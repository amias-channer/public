import { TypedDataUtils } from "eth-sig-util"
import { bufferToHex } from "ethereumjs-util"
import { Buffer } from "safe-buffer"
import Web3 from "web3"
import { ChainIdentifier } from "../../../constants"
import { ClientSignatureStandard } from "../../graphql/__generated__/ActionPanelList_data.graphql"
import { BigNumber, bn } from "../../helpers/numberUtils"
import { promisify0, promisify1 } from "../../helpers/promise"
import { AccountKey, Address } from "../chain"
import JSONRPC from "../jsonrpc"
import { CHAIN_IDENTIFIER_BY_NETWORK_ID } from "../networks/ethereum"
import Provider, { Transaction, TransactionId } from "../provider"
import { SignOptions } from "../wallet"

const GAS_PRICE_COEFFICIENT = 1.05

type Method =
  | "eth_requestAccounts"
  | "personal_sign"
  | "eth_signTypedData"
  | "eth_signTypedData_v1"
  | "eth_signTypedData_v3"
  | "eth_signTypedData_v4"
type Event = "accountsChanged" | "chainChanged"

// TODO: Upgrade web3
type Web3Provider = Web3.Provider & {
  off?: <T>(event: Event, handler: (value: T) => unknown) => void
  on?: <T>(event: Event, handler: (value: T) => unknown) => void
}

export default abstract class Web3EvmProvider extends Provider {
  abstract web3: Web3

  async call({
    source,
    destination,
    data,
  }: Transaction & {
    source: NonNullable<Transaction["source"]>
  }): Promise<TransactionId> {
    const accounts = await this.getAccounts()
    if (!accounts.some(a => a.address === source)) {
      throw new Error(`Not connected to account ${source}`)
    }
    return promisify1(this.web3.eth.call)({
      from: source,
      to: destination,
      data,
    })
  }

  async connect() {
    try {
      await this.request<Address[]>("eth_requestAccounts")
    } catch (_) {
      console.info(`${this.getName()} does not support eth_requestAccounts`)
    }
  }

  async estimateTransactionCost({
    source,
    destination,
    value,
    data,
  }: Transaction) {
    const gas = await promisify1(this.web3.eth.estimateGas)({
      from: source,
      to: destination,
      value,
      data,
    })
    return bn(gas).times(await this.getGasPrice())
  }

  async mapToAccounts(addresses: Address[]): Promise<AccountKey[]> {
    const chain = await this.getChain()
    return addresses.map(a => ({ address: a.toLowerCase(), chain }))
  }

  getChain = async () => {
    const networkId = await promisify0(this.web3.version.getNetwork)()
    return CHAIN_IDENTIFIER_BY_NETWORK_ID[Number(networkId)]
  }

  async getAccounts(): Promise<AccountKey[]> {
    const addresses = await promisify0(this.web3.eth.getAccounts)()
    return this.mapToAccounts(addresses)
  }

  async getBalance(address: Address): Promise<BigNumber> {
    return await promisify1(this.web3.eth.getBalance)(address)
  }

  async getGasPrice(): Promise<BigNumber> {
    const price = await promisify0(this.web3.eth.getGasPrice)()
    return price.times(GAS_PRICE_COEFFICIENT)
  }

  getWeb3Provider(): Web3Provider {
    return this.web3.currentProvider as Web3Provider
  }

  onEvent(event: Event, handler: (...args: any[]) => unknown): () => unknown {
    const web3Provider = this.getWeb3Provider()
    web3Provider.on?.(event, handler)
    return () => web3Provider.off?.(event, handler)
  }

  onAccountsChange(handler: (accounts: AccountKey[]) => unknown) {
    return this.onEvent("accountsChanged", (addresses: Address[]) =>
      this.mapToAccounts(addresses).then(handler),
    )
  }

  onChainChange(handler: (chainIdentifier: ChainIdentifier) => unknown) {
    return this.onEvent("chainChanged", (networkId: string) => {
      const chainIdentifier = CHAIN_IDENTIFIER_BY_NETWORK_ID[Number(networkId)]
      if (!chainIdentifier) {
        throw new Error(`Unexpected chain id ${networkId}`)
      }
      handler(chainIdentifier)
    })
  }

  async request<T>(method: Method, params: unknown[] = []): Promise<T> {
    const web3Provider = this.getWeb3Provider()
    return JSONRPC.request(
      web3Provider.sendAsync.bind(web3Provider),
      method,
      params,
    )
  }

  /**
   * Allows cross-chain signing for 0x due to its support of personal signatures:
   * https://github.com/0xProject/protocol/blob/development/contracts/exchange/contracts/src/MixinSignatureValidator.sol#L323-L343
   */
  async sign(message: string, address: string, options?: SignOptions) {
    const clientSignatureStandard =
      options?.clientSignatureStandard ?? "PERSONAL"

    const isTyped = clientSignatureStandard !== "PERSONAL"

    const hexMessage = bufferToHex(new Buffer(message, "utf8"))

    const signature = await this.request<string>("personal_sign", [
      isTyped
        ? `0x${TypedDataUtils.sign(
            TypedDataUtils.sanitizeData(JSON.parse(message)),
            true,
          ).toString("hex")}`
        : hexMessage,
      address,
    ])

    return `${isTyped ? this._reorderSignatureRsvToVrs(signature) : signature}${
      isTyped ? "03" : "" // 03: EthSign
    }`
  }

  async signTypedData(message: string, address: string, options?: SignOptions) {
    const clientSignatureStandard =
      options?.clientSignatureStandard ?? "TYPED_DATA_V4"

    const typedStandards = ["TYPED_DATA_V1", "TYPED_DATA_V3", "TYPED_DATA_V4"]

    if (!typedStandards.includes(clientSignatureStandard)) {
      throw new Error(
        `Unsupported client signature standard for signing typed data.`,
      )
    }

    const signatureToMethod: Record<ClientSignatureStandard, Method> = {
      PERSONAL: "personal_sign",
      TYPED_DATA_V1: "eth_signTypedData",
      TYPED_DATA_V3: "eth_signTypedData_v3",
      TYPED_DATA_V4: "eth_signTypedData_v4",
      "%future added value": "personal_sign",
    }

    const signature = await this.request<string>(
      signatureToMethod[clientSignatureStandard],
      [address, message],
    )

    return this._reorderSignatureRsvToVrs(signature)
  }

  async transact({
    source,
    destination,
    value,
    multiplyValueByGasPrice,
    data,
  }: Transaction & {
    source: NonNullable<Transaction["source"]>
  }): Promise<TransactionId> {
    const accounts = await this.getAccounts()
    if (!accounts.some(a => a.address === source)) {
      throw new Error(`Not connected to account ${source}`)
    }
    const gasPrice = await this.getGasPrice()
    return promisify1(this.web3.eth.sendTransaction)({
      from: source,
      to: destination,
      value: multiplyValueByGasPrice && value ? value.mul(gasPrice) : value,
      data,
      gasPrice,
    })
  }

  _reorderSignatureRsvToVrs(signature: string) {
    if (signature.length !== 132)
      throw new Error(
        "Expect signature to be a hex thing with a total length of 132 characters (including the '0x' prefix)",
      )
    // Version of signature should be 27 or 28 for Ethereum signatures, but 0 and 1 are also possible versions returned, ie from Ledger signing that need to be adapted
    let v = parseInt(signature.substr(-2), 16)
    if (v < 27) {
      v += 27
    }
    const vrs = {
      r: signature.substr(2, 64),
      s: signature.substr(66, 64),
      v: v.toString(16),
    }
    return `0x${vrs.v}${vrs.r}${vrs.s}`
  }
}
