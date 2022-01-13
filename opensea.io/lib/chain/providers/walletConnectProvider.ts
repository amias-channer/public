import type TWalletConnectWeb3Provider from "@walletconnect/web3-provider"
import Web3 from "web3"
import {
  ETHEREUM_MAINNET,
  ETHEREUM_RINKEBY,
  WALLET_NAME,
} from "../../../constants"
import Web3EvmProvider from "./web3EvmProvider"

class WalletConnectProvider extends Web3EvmProvider {
  web3: Web3
  walletConnectProvider: TWalletConnectWeb3Provider

  constructor(WalletConnectWeb3Provider: typeof TWalletConnectWeb3Provider) {
    super()
    this.walletConnectProvider = new WalletConnectWeb3Provider({
      bridge: "https://opensea.bridge.walletconnect.org",
      rpc: {
        1: ETHEREUM_MAINNET,
        4: ETHEREUM_RINKEBY,
      },
    })
    this.web3 = new Web3(this.walletConnectProvider as unknown as Web3.Provider)
  }

  async connect() {
    await this.walletConnectProvider.enable()
    super.connect()
  }

  getName() {
    return WALLET_NAME.WalletConnect
  }
}

const createWalletConnectProvider =
  async (): Promise<WalletConnectProvider> => {
    const WalletConnectWeb3Provider = (
      await import("@walletconnect/web3-provider")
    ).default

    return new WalletConnectProvider(WalletConnectWeb3Provider)
  }

export default createWalletConnectProvider
