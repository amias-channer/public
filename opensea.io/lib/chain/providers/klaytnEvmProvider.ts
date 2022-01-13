import { TypedDataUtils } from "eth-sig-util"
import { Buffer } from "safe-buffer"
import { ChainIdentifier, WALLET_NAME } from "../../../constants"
import { BigNumber } from "../../helpers/numberUtils"
import { Promiseable } from "../../helpers/promise"
import { AccountKey, Address } from "../chain"
import { JSONRPCRequest, JSONRPCResponse } from "../jsonrpc"
import Provider, { Transaction, TransactionId } from "../provider"
import { SignOptions } from "../wallet"

type Event = "accountsChanged" | "networkChanged"

interface KlayProvider {
  enable: () => Promise<Address[]>
  isKaikas?: boolean
  networkVersion: number
  off: <T>(event: Event, handler: (value: T) => unknown) => void
  on: <T>(event: Event, handler: (value: T) => unknown) => void
  sendAsync: <T>(
    request: JSONRPCRequest,
    callback: (error: Error, response: JSONRPCResponse<T>) => unknown,
  ) => void
}

interface Klay {
  currentProvider: KlayProvider
  getAccounts: () => Promise<Address[]>
  estimateGas: (transaction: {
    from?: Address
    to?: Address
    value?: BigNumber
    data?: string
  }) => Promise<number>
  sendTransaction: (transaction: {
    from?: Address
    to?: Address
    value?: BigNumber
    gasLimit?: number
    data?: string
  }) => Promise<{ transactionHash: TransactionId }>
  sign: (message: string, address: string) => Promise<string>
}

interface Caver {
  klay: Klay
}

interface CaverWindow {
  caver?: Caver
}

const CHAIN_IDENTIFIER_BY_NETWORK_ID: Record<number, ChainIdentifier> = {
  8217: "KLAYTN",
  1001: "BAOBAB",
}

export default class KlaytnEvmProvider extends Provider {
  klay: Klay

  constructor() {
    super()
    const w = window as CaverWindow
    const caver = w.caver
    if (caver) {
      this.klay = caver.klay
      return
    }
    throw new Error("Could not find caver")
  }

  async connect() {
    await this.klay.currentProvider.enable()
  }

  estimateTransactionCost(_transaction: Transaction): Promise<BigNumber> {
    throw new Error("Not implemented")
  }

  getChain(): ChainIdentifier {
    return CHAIN_IDENTIFIER_BY_NETWORK_ID[
      this.klay.currentProvider.networkVersion
    ]
  }

  mapToAccounts(addresses: Address[]): AccountKey[] {
    const chain = this.getChain()
    return addresses.map(address => ({ address: address.toLowerCase(), chain }))
  }

  async getAccounts(): Promise<AccountKey[]> {
    const addresses = await this.klay.getAccounts()
    return this.mapToAccounts(addresses)
  }

  getName(): WALLET_NAME {
    if (this.klay.currentProvider.isKaikas) {
      return WALLET_NAME.Kaikas
    }
    return WALLET_NAME.Native
  }

  onEvent(event: Event, handler: (...args: any[]) => unknown): () => unknown {
    this.klay.currentProvider.on(event, handler)
    return () => this.klay.currentProvider.off(event, handler)
  }

  onAccountsChange(handler: (accounts: AccountKey[]) => unknown) {
    return this.onEvent("accountsChanged", (addresses: Address[]) =>
      handler(this.mapToAccounts(addresses)),
    )
  }

  onChainChange(handler: (chainIdentifier: ChainIdentifier) => unknown) {
    return this.onEvent("networkChanged", () => handler(this.getChain()))
  }

  async sign(message: string | Buffer, address: string, options?: SignOptions) {
    if (
      !options?.clientSignatureStandard ||
      options?.clientSignatureStandard === "PERSONAL"
    )
      return this.klay.sign(message.toString(), address)

    const typedData = TypedDataUtils.sanitizeData(
      JSON.parse(message.toString()),
    )
    const hash = TypedDataUtils.sign(typedData, true) // Boolean true signifies to use TypedData V4 (as opposed to V1).
    const signature = await this.klay.sign("0x" + hash.toString("hex"), address)
    return `${this._reorderSignatureRsvToVrs(signature)}03` // 02: EIP712, 03: EthSign
  }

  signTypedData(
    _message: string | Buffer,
    _address: string,
    _options?: SignOptions,
  ): Promiseable<string> {
    throw new Error("Sign Typed Data not supported on Klatyn.")
  }

  async transact({
    source,
    destination,
    value,
    data,
  }: Transaction & {
    source: NonNullable<Transaction["source"]>
  }): Promise<TransactionId> {
    const accounts = await this.getAccounts()
    if (!accounts.some(a => a.address === source)) {
      throw new Error(`Not connected to account ${source}`)
    }
    const gasLimit = await this.klay.estimateGas({
      from: source,
      to: destination,
      value,
      data,
    })
    const transaction = await this.klay.sendTransaction({
      from: source,
      to: destination,
      value,
      gasLimit,
      data,
    })
    return transaction.transactionHash
  }

  _reorderSignatureRsvToVrs(signature: string) {
    if (signature.length !== 132)
      throw new Error(
        "Expect signature to be a hex thing with a total length of 132 characters (including the '0x' prefix)",
      )
    const vrs = {
      r: signature.substr(2, 64),
      s: signature.substr(66, 64),
      v: signature.substr(-2),
    }
    return `0x${vrs.v}${vrs.r}${vrs.s}`
  }
}
