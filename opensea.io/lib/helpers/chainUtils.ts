import { ChainIdentifier, CHAIN_IDENTIFIER_ENUM_MAPPING } from "../../constants"
import { getIsTestnet } from "../../store"

export function isMultichain(chain?: ChainIdentifier): boolean {
  return !!chain && !(chain === "ETHEREUM" || chain === "RINKEBY")
}

export function isSupportedChain(chain?: ChainIdentifier): boolean {
  return (
    !chain ||
    !isMultichain(chain) ||
    (["KLAYTN", "BAOBAB", "MATIC", "MUMBAI"] as ChainIdentifier[]).includes(
      chain,
    )
  )
}

export const chainIdentifierWithTrailingSlash = (chain?: ChainIdentifier) =>
  chain && isMultichain(chain) ? `${CHAIN_IDENTIFIER_ENUM_MAPPING[chain]}/` : ""

export function getDefaultChain(): "RINKEBY" | "ETHEREUM" {
  return getIsTestnet() ? "RINKEBY" : "ETHEREUM"
}
