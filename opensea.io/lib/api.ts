import { IncomingMessage } from "http"
import {
  API_URL,
  IS_SERVER,
  OPENSEA_API_URL,
  OPENSEA_LOCALHOST_URL,
  OPENSEA_TESTNETS_API_URL,
  OPENSEA_TESTNETS_URL,
  OPENSEA_URL,
} from "../constants"
import { getIsTestnet } from "../store"

const API_KEY = (process.env.SSR_API_KEY ||
  process.env.NEXT_PUBLIC_API_KEY) as string

const API = {
  doesMatchServerLabel: (label: string, request?: IncomingMessage): boolean =>
    (!IS_SERVER && location.host.toLowerCase().startsWith(label)) ||
    process.env.NETWORK === label ||
    !!request?.headers.host?.toLowerCase().startsWith(label),

  getIsLocalhost: (request?: IncomingMessage) =>
    (!IS_SERVER && location.host.toLowerCase().startsWith("localhost")) ||
    request?.headers.host?.toLowerCase().startsWith("localhost"),

  getKey: () => API_KEY,

  getUrl: () =>
    API_URL || (getIsTestnet() ? OPENSEA_TESTNETS_API_URL : OPENSEA_API_URL),

  getWebUrl: (request?: IncomingMessage) =>
    API.getIsLocalhost(request)
      ? OPENSEA_LOCALHOST_URL
      : getIsTestnet()
      ? OPENSEA_TESTNETS_URL
      : OPENSEA_URL,
}

export default API
