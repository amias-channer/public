import { ParsedUrlQuery } from "querystring"
import {
  ARKANE_LINK,
  AUTHEREUM_LINK,
  BITSKI_LINK,
  COINBASE_WALLET_URL,
  DAPPER_LINK,
  FORTMATIC_URL,
  METAMASK_MOBILE_URL,
  METAMASK_URL,
  OPERA_TOUCH_URL,
  TORUS_URL,
  TRUST_WALLET_URL,
  WALLET_NAME,
  WALLETCONNECT_URL,
  KAIKAS_URL,
  PORTIS_URL,
  getWalletConfiguration,
} from "../../constants"
import API from "../api"

/**
 * Get a logo for a wallet type
 * @param type The wallet type or type of injected (native) wallet
 * @param vertical whether to use a veritical image
 */
export function getWalletLogo(
  type: WALLET_NAME,
  displayType: "horizontal" | "vertical" = "horizontal",
): string {
  const configuration = getWalletConfiguration(type)
  return displayType === "vertical"
    ? configuration.alternativeLogo
    : configuration.logo
}

/**
 * Get the link to download a wallet type
 * @param type The wallet type or type of injected (native) wallet
 */
export function getWalletLink(type: WALLET_NAME): string {
  switch (type) {
    case WALLET_NAME.MetaMask:
      return METAMASK_URL
    case WALLET_NAME.Dapper:
      return DAPPER_LINK
    case WALLET_NAME.Bitski:
      return BITSKI_LINK
    case WALLET_NAME.Fortmatic:
      return FORTMATIC_URL
    case WALLET_NAME.Portis:
      return PORTIS_URL
    case WALLET_NAME.Trust:
      return TRUST_WALLET_URL
    case WALLET_NAME.CoinbaseWallet:
      return COINBASE_WALLET_URL
    case WALLET_NAME.Authereum:
      return AUTHEREUM_LINK
    case WALLET_NAME.Arkane:
      return ARKANE_LINK
    case WALLET_NAME.WalletConnect:
      return WALLETCONNECT_URL
    case WALLET_NAME.Torus:
      return TORUS_URL
    case WALLET_NAME.OperaTouch:
      return OPERA_TOUCH_URL
    case WALLET_NAME.Kaikas:
      return KAIKAS_URL
    case WALLET_NAME.Native:
      return ""
    default:
      console.error(`Unknown wallet type: ${type}`)
      return ""
  }
}

export const walletError = new Error(
  "Wallet disconnected. Refresh the page and try again.",
)

export function metamaskMobileLink(query: ParsedUrlQuery) {
  const mmReferrer =
    typeof query?.referrer === "string"
      ? decodeURIComponent(query.referrer)
      : ""

  return `${METAMASK_MOBILE_URL}${API.getWebUrl().replace(
    "https://",
    "",
  )}${mmReferrer}`
}

export function trustMobileLink(query: ParsedUrlQuery) {
  const trustReferrer = `${API.getWebUrl()}${query.referrer ?? ""}`
  return `${TRUST_WALLET_URL}${trustReferrer}`
}

export function getMobileWalletLink(
  walletName: WALLET_NAME,
  query: ParsedUrlQuery,
) {
  switch (walletName) {
    case WALLET_NAME.MetaMask:
      return metamaskMobileLink(query)
    case WALLET_NAME.Trust:
      return trustMobileLink(query)
    case WALLET_NAME.OperaTouch:
      return OPERA_TOUCH_URL
    default:
      return undefined
  }
}
