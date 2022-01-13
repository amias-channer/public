import Web3 from "web3"
import { WALLET_NAME } from "../../../constants"
import Ethereum from "../networks/ethereum"
import Web3EvmProvider from "./web3EvmProvider"

class ArkaneProvider extends Web3EvmProvider {
  web3: Web3

  constructor(web3Provider: Web3.Provider) {
    super()
    this.web3 = new Web3(web3Provider)
  }

  getName() {
    return WALLET_NAME.Arkane
  }
}

const createArkaneProvider = async (): Promise<ArkaneProvider> => {
  const Arkane = await import("@arkane-network/web3-arkane-provider")

  const web3Provider = await Arkane.Arkane.createArkaneProviderEngine({
    clientId: "OpenSea",
    environment:
      Ethereum.getChainName() === "RINKEBY" ? "staging" : "production",
    // rpcUrl: "https://mainnet.infura.io/v3/" + INFURA_ID
    signMethod: "POPUP",
    skipAuthentication: false,
  })

  return new ArkaneProvider(web3Provider as unknown as Web3.Provider)
}

export default createArkaneProvider
