import { IncomingMessage } from "http"
import { ChainIdentifier } from "../../../constants"
import API from "../../api"
import { keys } from "../../helpers/object"

export const CHAIN_IDENTIFIER_BY_NETWORK_ID: Record<number, ChainIdentifier> = {
  1: "ETHEREUM",
  4: "RINKEBY",
  5: "GOERLI",
  137: "MATIC",
  80001: "MUMBAI",
}

const Ethereum = {
  // TODO: Remove
  getChainName: (request?: IncomingMessage): ChainIdentifier =>
    API.doesMatchServerLabel("rinkeby", request) ||
    API.doesMatchServerLabel("testnet", request)
      ? "RINKEBY"
      : "ETHEREUM",

  getChainId: (request?: IncomingMessage): number =>
    keys(CHAIN_IDENTIFIER_BY_NETWORK_ID).find(
      id =>
        CHAIN_IDENTIFIER_BY_NETWORK_ID[id] === Ethereum.getChainName(request),
    ) || 1,

  // TODO: multi-chain
  getTransactionUrl: (hash: string) =>
    `https://${
      Ethereum.getChainName() === "RINKEBY" ? "rinkeby." : ""
    }etherscan.io/tx/${hash}`,
}
export default Ethereum
