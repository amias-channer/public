// Needed to prevent regeneratorRuntime is not defined error
import "regenerator-runtime/runtime"
import {
  Headers,
  Middleware,
  RelayNetworkLayerRequest,
  RelayNetworkLayerResponse,
  authMiddleware,
  perfMiddleware,
  // progressMiddleware,
  // retryMiddleware,
  uploadMiddleware,
  urlMiddleware,
} from "react-relay-network-modern"
import ClientRelaySSR from "react-relay-network-modern-ssr/lib/client"
import ServerRelaySSR from "react-relay-network-modern-ssr/lib/server"
import { CacheConfig, Environment } from "relay-runtime"
import { BUILD_ID, IS_PRODUCTION, IS_SERVER } from "../../../constants"
import API from "../../api"
import Auth from "../../auth"
import Wallet from "../../chain/wallet"
import { pFormat, pLog } from "../../helpers/stringUtils"
import batchMiddleware from "./middlewares/batchMiddleware"
import cacheMiddleware from "./middlewares/cacheMiddleware"
import testnetMiddleware from "./middlewares/testnetMiddleware"
import tracingMiddleware from "./middlewares/tracingMiddleware"
import * as graphqlSetup from "./setup"

export type FetchConfig = CacheConfig & {
  isBatched?: boolean
  useLocalhost?: boolean
}
export type RelayCache = Array<[string, RelayNetworkLayerResponse]>
export type RelayCacheConfigMetadata = { wallet?: Wallet }
export type RelayRequestWithMetadata = RelayNetworkLayerRequest & {
  cacheConfig: { metadata?: RelayCacheConfigMetadata }
}

interface RelayResponse {
  ok: boolean
  status: number
  url: string
  headers: Headers
  json: {
    data: object | null
    errors?: Array<{
      message: string
      locations: Array<{
        line: number
        column: number
      }>
      path: string[]
    }> | null
  }
  data: object | null
}

const getHeaders = (req: RelayRequestWithMetadata): Headers => {
  const headers: Headers = {
    "X-API-KEY": API.getKey(),
    "X-BUILD-ID": BUILD_ID,
  }

  const wallet = IS_SERVER ? req.cacheConfig.metadata?.wallet : Wallet.wallet
  if (wallet?.address) {
    headers["X-VIEWER-ADDRESS"] = wallet.address
  }

  if (IS_SERVER) {
    headers["User-Agent"] = "OpenSea/Next/SSR"
  }

  return headers
}

const middlewares: Array<Middleware | null> = [
  IS_SERVER ? tracingMiddleware() : null, // TODO: maybe move behind cache?
  cacheMiddleware({
    clearOnMutation: true,
    size: 100, // max 100 requests
    ttl: IS_SERVER ? 3000 : 60000, // 3 seconds on server, 1 minute on client
  }),
  IS_PRODUCTION
    ? null
    : perfMiddleware({
        logger: async (
          heading: string,
          req: RelayNetworkLayerRequest,
          res: RelayResponse,
        ) => {
          const session = await Auth.UNSAFE_getActiveSession()
          const prefix = `[RELAY] ${heading}(\n${pFormat(
            req.variables,
          )},\n${pFormat({
            session: session?.token,
            viewer: Wallet.wallet?.getActiveAccountKey(),
          })}\n) -->`
          const { errors } = res.json
          if (errors) {
            console.error(
              `${prefix} (FAIL)\n${pFormat(errors.map(e => e.message))}`,
            )
          } else {
            console.log(`${prefix} (SUCCESS)`)
          }
          pLog(res.json)
        },
      }),
  // retryMiddleware({
  //   fetchTimeout: 15000,
  //   retryDelays: attempt => Math.pow(2, attempt + 4) * 100,
  //   beforeRetry: ({ abort, attempt, forceRetry }) => {
  //     if (attempt > 10) {
  //       abort()
  //     }
  //     if (!IS_SERVER) {
  //       // @ts-ignore
  //       window.forceRelayRetry = forceRetry
  //     }
  //   },
  //   statusCodes: [500, 503, 504],
  // }),
  // progressMiddleware({
  //   onProgress: (current, total) => {
  //     console.log("Downloaded: " + current + " B, total: " + total + " B")
  //   },
  // }),
  uploadMiddleware(),
  urlMiddleware({
    url: req =>
      `${
        (req.cacheConfig as FetchConfig).useLocalhost
          ? "http://localhost:8000"
          : API.getUrl()
      }/graphql/`,
    headers: getHeaders,
  }),
  batchMiddleware({
    batchUrl: () => `${API.getUrl()}/graphql/batch/`,
    batchTimeout: 10,
    headers: req => getHeaders(req.requests[0]),
  }),
  authMiddleware({
    token: async () => {
      const session = await Auth.UNSAFE_getActiveSession()
      return session?.token || ""
    },
    allowEmptyToken: true,
    prefix: "JWT ",
  }),
  testnetMiddleware(),
]

export const createServerEnvironment = (): {
  relaySSR: ServerRelaySSR
  environment: Environment
} => {
  const relaySSR = new ServerRelaySSR()
  return {
    relaySSR,
    environment: graphqlSetup.createServerEnvironment([
      relaySSR.getMiddleware(),
      ...middlewares,
    ]),
  }
}

let environment: Environment | undefined
export const getClientEnvironment = (): Environment => {
  if (environment) {
    return environment
  }

  environment = graphqlSetup.createClientEnvironment([
    new ClientRelaySSR().getMiddleware({ lookup: false }),
    ...middlewares,
  ])

  return environment
}

export const getEnvironment = () => {
  return IS_SERVER
    ? createServerEnvironment().environment
    : getClientEnvironment()
}
