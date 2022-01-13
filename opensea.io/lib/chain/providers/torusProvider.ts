import Web3 from "web3"
import { CHAIN_IDENTIFIER_ENUM_MAPPING, WALLET_NAME } from "../../../constants"
import Ethereum from "../networks/ethereum"
import Web3EvmProvider from "./web3EvmProvider"

class TorusProvider extends Web3EvmProvider {
  torus: Torus
  web3: Web3

  constructor(torus: Torus) {
    super()
    this.torus = torus
    this.web3 = new Web3(this.torus.provider as unknown as Web3.Provider)
  }

  async connect() {
    await this.torus.login({})
    super.connect()
  }

  getName() {
    return WALLET_NAME.Torus
  }
}

const createTorusProvider = async (): Promise<TorusProvider> => {
  const Torus = (await import("@toruslabs/torus-embed")).default

  const torus = new Torus({})
  const chain = Ethereum.getChainName()
  await torus.init({
    network: {
      // TODO: Multichain
      host:
        chain === "ETHEREUM" ? "mainnet" : CHAIN_IDENTIFIER_ENUM_MAPPING[chain],
      chainId: Ethereum.getChainId(),
    },
  })

  return new TorusProvider(torus)
}
export default createTorusProvider
