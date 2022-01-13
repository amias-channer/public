// Needed to prevent regeneratorRuntime is not defined error
import "regenerator-runtime/runtime"
import {
  Middleware,
  RelayNetworkLayerResponse,
} from "react-relay-network-modern"
import { ConcreteRequest, QueryResponseCache, Variables } from "relay-runtime"
import { RelayRequestWithMetadata } from "../"
import { IS_SERVER } from "../../../../constants"
import Auth from "../../../auth"
import Wallet from "../../../chain/wallet"
import { trim } from "../../../helpers/object"

// size - max number of request in cache, least-recently updated entries purged first (default: 100).
// ttl - number in milliseconds, how long records stay valid in cache (default: 900000, 15 minutes).
// allowMutations - allow to cache Mutation requests (default: false)
// allowFormData - allow to cache FormData requests (default: false)
// clearOnMutation - clear the cache on any Mutation (default: false)
// cacheErrors - cache responses with errors (default: false)

interface CacheOptions {
  size: number
  ttl: number
  allowMutations?: boolean
  allowFormData?: boolean
  clearOnMutation?: boolean
  cacheErrors?: boolean
}

const DEFAULT_OPTIONS: CacheOptions = {
  size: 100,
  ttl: 15 * 60 * 1000, // 15 minutes
  allowMutations: false,
  allowFormData: false,
  clearOnMutation: false,
  cacheErrors: false,
}

let forceCache = false

// NOTE (joshuawu): This is a workaround for Relay's PaginationContainer whose refetchConnection() always forces a refetch.
// See https://github.com/facebook/relay/blob/d249e75e7ebe0c6a5f36380a3604e8dc7385188b/packages/react-relay/ReactRelayPaginationContainer.js#L602-L606
export const withCache = async <T>(fn: () => Promise<T>): Promise<T> => {
  forceCache = true
  try {
    return fn()
  } finally {
    forceCache = false
  }
}

const queryAliases: { [queryID: string]: string } = {}

// TODO (joshuawu): Investigate better solutions for avoiding redundant refetch/pagination queries
export const aliasQuery = (
  query: ConcreteRequest,
  alias: ConcreteRequest,
): void => {
  queryAliases[query.operation.name] = alias.operation.name
}

const processVariables = async (
  variables: Variables,
  request?: RelayRequestWithMetadata,
): Promise<Variables> => {
  const accountKey = (
    IS_SERVER ? request?.cacheConfig.metadata?.wallet : Wallet.UNSAFE_get()
  )?.getActiveAccountKey()
  const session = await Auth.UNSAFE_getActiveSession()
  return trim({
    _authToken: session?.token,
    _viewerAddress: accountKey?.address,
    ...variables,
  })
}

let cache: QueryResponseCache

export const clearCache = (): void => cache.clear()

export const getCacheEntry = async (
  queryID: string,
  rawVariables: Variables,
  request?: RelayRequestWithMetadata,
): Promise<RelayNetworkLayerResponse | undefined> => {
  const variables = await processVariables(rawVariables, request)
  // @ts-expect-error TODO: description
  return cache.get(queryID, variables) || undefined
}

export const setCacheEntry = async (
  queryID: string,
  rawVariables: Variables,
  response: RelayNetworkLayerResponse,
  request?: RelayRequestWithMetadata,
): Promise<void> => {
  const variables = await processVariables(rawVariables, request)
  // @ts-expect-error TODO: description
  cache.set(queryID, variables, response)
  const queryAlias = queryAliases[queryID]
  if (queryAlias) {
    // @ts-expect-error TODO: description
    cache.set(queryAlias, variables, response)
  }
}

const cacheMiddleware = (options: CacheOptions): Middleware => {
  const {
    size,
    ttl,
    allowMutations,
    allowFormData,
    clearOnMutation,
    cacheErrors,
  } = { ...DEFAULT_OPTIONS, ...options }
  cache = new QueryResponseCache({ size, ttl })
  return next =>
    async (request): Promise<RelayNetworkLayerResponse> => {
      if ("requests" in request) {
        // TODO (joshuawu): Support batch requests
        return next(request)
      }
      if (request.isMutation()) {
        if (clearOnMutation) {
          cache.clear()
        }
        if (!allowMutations) {
          return next(request)
        }
      }
      if (request.isFormData() && !allowFormData) {
        return next(request)
      }
      const queryID = request.getID()
      const variables = request.getVariables()
      if (forceCache || !request.cacheConfig?.force) {
        const cachedResponse = await getCacheEntry(queryID, variables, request)
        if (cachedResponse) {
          return cachedResponse
        }
      }
      const response = await next(request)
      if (!response.errors || (response.errors && cacheErrors)) {
        setCacheEntry(queryID, variables, response, request)
      }
      return response
    }
}
export default cacheMiddleware
