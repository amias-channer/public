import type TAuthereumModule from "authereum"
import Web3 from "web3"
import { AUTHEREUM_API_KEY, WALLET_NAME } from "../../../constants"
import Ethereum from "../networks/ethereum"
import Web3EvmProvider from "./web3EvmProvider"

interface Authereum {
  getProvider(): Web3.Provider
  login(): Promise<unknown>
}

class AuthereumProvider extends Web3EvmProvider {
  web3: Web3
  authereum: Authereum

  constructor(Authereum: typeof TAuthereumModule) {
    super()

    this.authereum = new Authereum({
      networkName:
        Ethereum.getChainName() === "RINKEBY" ? "rinkeby" : "mainnet",
      apiKey: AUTHEREUM_API_KEY,
    })
    this.web3 = new Web3(this.authereum.getProvider())
  }

  async connect() {
    await this.authereum.login()
    super.connect()
  }

  getName() {
    return WALLET_NAME.Authereum
  }
}

const createAuthereumProvider = async (): Promise<AuthereumProvider> => {
  const Authereum = (await import("authereum")).default

  return new AuthereumProvider(Authereum)
}

export default createAuthereumProvider
