import type TBitskiModule from "bitski"
import Web3 from "web3"
import { BITSKI_CLIENT_ID, WALLET_NAME } from "../../../constants"
import API from "../../api"
import Ethereum from "../networks/ethereum"
import Web3EvmProvider from "./web3EvmProvider"

class BitskiProvider extends Web3EvmProvider {
  Bitski: typeof TBitskiModule
  bitski: TBitskiModule.Bitski
  web3: Web3

  constructor(Bitski: typeof TBitskiModule) {
    super()

    this.bitski = new Bitski.Bitski(
      BITSKI_CLIENT_ID,
      `${API.getWebUrl()}/callback/bitski`,
    )
    this.Bitski = Bitski
    this.web3 = new Web3(
      (Ethereum.getChainName() === "RINKEBY"
        ? this.bitski.getProvider({ networkName: "rinkeby" })
        : this.bitski.getProvider()) as unknown as Web3.Provider,
    )
  }

  async connect() {
    if (
      this.bitski.authStatus === this.Bitski.AuthenticationStatus.NotConnected
    ) {
      await this.bitski.signIn()
    }
    super.connect()
  }

  getName() {
    return WALLET_NAME.Bitski
  }
}

const createBitskiProvider = async (): Promise<BitskiProvider> => {
  const Bitski = await import("bitski")

  return new BitskiProvider(Bitski)
}

export default createBitskiProvider
