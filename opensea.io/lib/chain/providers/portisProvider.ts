import Portis from "@portis/web3"
import Web3 from "web3"
import {
  CHAIN_IDENTIFIER_ENUM_MAPPING,
  PORTIS_API_KEY,
  WALLET_NAME,
} from "../../../constants"
import Ethereum from "../networks/ethereum"
import Web3EvmProvider from "./web3EvmProvider"

class PortisProvider extends Web3EvmProvider {
  web3: Web3

  constructor(portis: typeof Portis) {
    super()
    const chain = Ethereum.getChainName()
    this.web3 = new Web3(
      new portis(
        PORTIS_API_KEY,
        chain === "ETHEREUM"
          ? "mainnet"
          : chain === "MUMBAI"
          ? "maticMumbai"
          : CHAIN_IDENTIFIER_ENUM_MAPPING[chain],
        // @ts-expect-error TODO: description
      ).provider as Web3.Provider,
    )
  }

  async connect() {
    await this.getAccounts()
    super.connect()
  }

  getName() {
    return WALLET_NAME.Portis
  }
}

const createPortisProvider = async (): Promise<PortisProvider> => {
  const Portis = (await import("@portis/web3")).default

  return new PortisProvider(Portis)
}

export default createPortisProvider
