import type TFortmaticModule from "fortmatic"
import Web3 from "web3"
import {
  FORTMATIC_API_KEY,
  FORTMATIC_TESTNET_API_KEY,
  WALLET_NAME,
} from "../../../constants"
import Ethereum from "../networks/ethereum"
import Web3EvmProvider from "./web3EvmProvider"

class FortmaticProvider extends Web3EvmProvider {
  web3: Web3

  constructor(Fortmatic: typeof TFortmaticModule) {
    super()

    this.web3 = new Web3(
      new Fortmatic(
        Ethereum.getChainName() === "RINKEBY"
          ? FORTMATIC_TESTNET_API_KEY
          : FORTMATIC_API_KEY,
      ).getProvider() as unknown as Web3.Provider,
    )
  }

  async connect() {
    await this.getAccounts()
    super.connect()
  }

  getName() {
    return WALLET_NAME.Fortmatic
  }
}

const createFortmaticProvider = async (): Promise<FortmaticProvider> => {
  const Fortmatic = (await import("fortmatic")).default

  return new FortmaticProvider(Fortmatic)
}

export default createFortmaticProvider
