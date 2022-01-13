import type TWalletLink from "walletlink"
import Web3 from "web3"
import {
  ETHEREUM_MAINNET,
  ETHEREUM_RINKEBY,
  OPENSEA_LOGO_IMG,
  WALLET_NAME,
  OPENSEA_URL,
} from "../../../constants"
import Ethereum from "../networks/ethereum"
import Web3EvmProvider from "./web3EvmProvider"

class WalletLinkProvider extends Web3EvmProvider {
  web3: Web3

  constructor(WalletLink: typeof TWalletLink) {
    super()
    const walletLink = new WalletLink({
      appLogoUrl: `${OPENSEA_URL}${OPENSEA_LOGO_IMG}`,
      appName: "OpenSea",
      darkMode: false,
    })
    const web3Provider = walletLink.makeWeb3Provider(
      Ethereum.getChainName() === "RINKEBY"
        ? ETHEREUM_RINKEBY
        : ETHEREUM_MAINNET,
      Ethereum.getChainId(),
    )
    this.web3 = new Web3(web3Provider as Web3.Provider)
  }

  getName() {
    return WALLET_NAME.CoinbaseWallet
  }
}

const createWalletLinkProvider = async (): Promise<WalletLinkProvider> => {
  const WalletLink = (await import("walletlink")).default

  return new WalletLinkProvider(WalletLink)
}

export default createWalletLinkProvider
