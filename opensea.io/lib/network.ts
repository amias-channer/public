import { OpenSeaPort, Network as NetworkName } from "opensea-js"
import ExchangeActions from "../actions/exchange"
import { API_URL } from "../constants"
import { dispatch, getIsTestnet } from "../store"
import API from "./api"
import chain from "./chain/chain"
import Web3EvmProvider from "./chain/providers/web3EvmProvider"
import Wallet from "./chain/wallet"

const Network = {
  getNetworkName(): NetworkName {
    return getIsTestnet() ? NetworkName.Rinkeby : NetworkName.Main
  },

  async seaport(): Promise<OpenSeaPort | undefined> {
    const walletProvider = await Wallet.wallet?.getProvider()
    const provider =
      walletProvider instanceof Web3EvmProvider
        ? walletProvider
        : chain.providers.find(
            (provider): provider is Web3EvmProvider =>
              provider instanceof Web3EvmProvider,
          )
    if (!provider) {
      // TODO: Move off seaport
      return undefined
    }
    const seaport = new OpenSeaPort(
      provider.web3.currentProvider,
      {
        apiBaseUrl: API_URL,
        apiKey: API.getKey(),
        networkName: Network.getNetworkName(),
      },
      arg => console.info(arg),
    )
    await dispatch(ExchangeActions.handleSeaportEvents(seaport))
    return seaport
  },
}
export default Network
