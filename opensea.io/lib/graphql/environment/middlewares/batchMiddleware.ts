import { isFunction } from "util"
import {
  FetchOpts,
  Middleware,
  MiddlewareNextFn,
  RelayNetworkLayerRequest,
  RelayNetworkLayerRequestBatch,
  RelayNetworkLayerResponse,
  RelayRequestAny,
  RRNLError,
} from "react-relay-network-modern"
import { FetchConfig } from "../"

// Max out at roughly 100kb (express-graphql imposed max)
const DEFAULT_BATCH_SIZE = 102400

type Headers = { [name: string]: string }

export type BatchMiddlewareOpts = {
  batchUrl?:
    | string
    | Promise<string>
    | ((requestList: RequestWrapper[]) => string | Promise<string>)
  batchTimeout?: number
  maxBatchSize?: number
  allowMutations?: boolean
  method?: "POST" | "GET"
  headers?:
    | Headers
    | Promise<Headers>
    | ((req: RelayNetworkLayerRequestBatch) => Headers | Promise<Headers>)
} & Pick<FetchOpts, "credentials" | "mode" | "cache" | "redirect">

export interface RequestWrapper {
  req: RelayNetworkLayerRequest
  completeOk: (res: RelayNetworkLayerResponse) => void
  completeErr: (e: Error) => void
  done: boolean
  duplicates: Array<RequestWrapper>
}

interface Batcher {
  bodySize: number
  requestList: RequestWrapper[]
  acceptRequests: boolean
}

export class RRNLBatchMiddlewareError extends RRNLError {
  constructor(msg: string) {
    super(msg)
    this.name = "RRNLBatchMiddlewareError"
  }
}

export default function batchMiddleware(
  options?: BatchMiddlewareOpts,
): Middleware {
  const opts = options || {}
  const batchTimeout = opts.batchTimeout || 0 // 0 is the same as nextTick in nodeJS
  const allowMutations = opts.allowMutations || false
  const batchUrl = opts.batchUrl || "/graphql/batch"
  const maxBatchSize = opts.maxBatchSize || DEFAULT_BATCH_SIZE
  const singleton = {}

  const fetchOpts: Partial<FetchOpts> = {}
  if (opts.method) fetchOpts.method = opts.method
  if (opts.credentials) fetchOpts.credentials = opts.credentials
  if (opts.mode) fetchOpts.mode = opts.mode
  if (opts.cache) fetchOpts.cache = opts.cache
  if (opts.redirect) fetchOpts.redirect = opts.redirect
  if (opts.headers) fetchOpts.headersOrThunk = opts.headers

  return next =>
    (req: RelayRequestAny): Promise<RelayNetworkLayerResponse> => {
      // do not batch mutations unless allowMutations = true
      if (req.isMutation() && !allowMutations) {
        return next(req)
      }

      if (!(req instanceof RelayNetworkLayerRequest)) {
        throw new RRNLBatchMiddlewareError(
          "Relay batch middleware accepts only simple RelayNetworkLayerRequest. Did you add batchMiddleware twice?",
        )
      }

      // req with FormData can not be batched
      if (req.isFormData()) {
        return next(req)
      }

      const fetchConfig: FetchConfig = req.cacheConfig
      if (!fetchConfig.isBatched) {
        return next(req)
      }

      return passThroughBatch(req, next, {
        batchTimeout,
        batchUrl,
        singleton,
        maxBatchSize,
        fetchOpts,
      })
    }
}

// FIXME: type opts
function passThroughBatch(
  req: RelayNetworkLayerRequest,
  next: MiddlewareNextFn,
  opts: any,
): Promise<RelayNetworkLayerResponse> {
  const { singleton } = opts

  const bodyLength = (req.getBody() as string).length
  if (!bodyLength) {
    return next(req)
  }

  if (!singleton.batcher || !singleton.batcher.acceptRequests) {
    singleton.batcher = prepareNewBatcher(next, opts)
  }

  if (singleton.batcher.bodySize + bodyLength + 1 > opts.maxBatchSize) {
    singleton.batcher = prepareNewBatcher(next, opts)
  }

  // +1 accounts for tailing comma after joining
  singleton.batcher.bodySize += bodyLength + 1

  // queue request
  return new Promise((resolve, reject) => {
    const { requestList } = singleton.batcher

    const requestWrapper: RequestWrapper = {
      req,
      completeOk: res => {
        requestWrapper.done = true
        resolve(res)
        requestWrapper.duplicates.forEach(r => r.completeOk(res))
      },
      completeErr: err => {
        requestWrapper.done = true
        reject(err)
        requestWrapper.duplicates.forEach(r => r.completeErr(err))
      },
      done: false,
      duplicates: [],
    }

    const duplicateIndex = requestList.findIndex(
      (wrapper: RequestWrapper) => req.getBody() === wrapper.req.getBody(),
    )

    if (duplicateIndex !== -1) {
      /*
        I've run into a scenario with Relay Classic where if you have 2 components
        that make the exact same query, Relay will dedup the queries and reuse
        the request ids but still make 2 requests. The batch code then loses track
        of all the duplicate requests being made and never resolves or rejects
        the duplicate requests
        https://github.com/nodkz/react-relay-network-layer/pull/52
      */
      requestList[duplicateIndex].duplicates.push(requestWrapper)
    } else {
      requestList.push(requestWrapper)
    }
  })
}

// FIXME: type opts
function prepareNewBatcher(next: MiddlewareNextFn, opts: any): Batcher {
  const batcher: Batcher = {
    bodySize: 2, // account for '[]'
    requestList: [],
    acceptRequests: true,
  }

  setTimeout(async () => {
    batcher.acceptRequests = false
    try {
      await sendRequests(batcher.requestList, next, opts)
      finalizeUncompleted(batcher.requestList)
    } catch (e) {
      if (batcher.requestList.length === 1) {
        throw e
      }
      if (e && e.name === "AbortError") {
        finalizeCanceled(batcher.requestList, e)
      } else {
        finalizeUncompleted(batcher.requestList)
      }
    }
  }, opts.batchTimeout)

  return batcher
}

// FIXME: type opts
async function sendRequests(
  requestList: RequestWrapper[],
  next: MiddlewareNextFn,
  opts: any,
) {
  if (requestList.length === 1) {
    // SEND AS SINGLE QUERY
    const wrapper = requestList[0]

    const res = await next(wrapper.req)
    wrapper.completeOk(res)
    wrapper.duplicates.forEach(r => r.completeOk(res))
    return res
  } else if (requestList.length > 1) {
    // SEND AS BATCHED QUERY

    const batchRequest = new RelayNetworkLayerRequestBatch(
      // @ts-expect-error: Declared type for RelayNetworkLayerRequestBatch is wrong
      requestList.map(wrapper => wrapper.req),
    )
    // $FlowFixMe
    const url = await (isFunction(opts.batchUrl)
      ? opts.batchUrl(requestList)
      : opts.batchUrl)
    batchRequest.setFetchOption("url", url)

    const { headersOrThunk, ...fetchOpts } = opts.fetchOpts
    batchRequest.setFetchOptions(fetchOpts)

    if (headersOrThunk) {
      const headers = await (isFunction(headersOrThunk)
        ? headersOrThunk(batchRequest)
        : headersOrThunk)
      batchRequest.setFetchOption("headers", headers)
    }

    try {
      const batchResponse = await next(batchRequest)
      if (!batchResponse || !Array.isArray(batchResponse.json)) {
        throw new RRNLBatchMiddlewareError(
          "Wrong response from server. Did your server support batch request?",
        )
      }

      batchResponse.json.forEach((payload: any, index) => {
        if (!payload) return
        const request = requestList[index]
        if (request) {
          const res = createSingleResponse(batchResponse, payload)
          request.completeOk(res)
        }
      })

      return batchResponse
    } catch (e) {
      requestList.forEach(request => request.completeErr(e))
    }
  }

  return Promise.resolve()
}

// check that server returns responses for all requests
function finalizeCanceled(requestList: RequestWrapper[], error: Error) {
  requestList.forEach(request => request.completeErr(error))
}

// check that server returns responses for all requests
function finalizeUncompleted(requestList: RequestWrapper[]) {
  requestList.forEach((request, index) => {
    if (!request.done) {
      request.completeErr(
        new RRNLBatchMiddlewareError(
          `Server does not return response for request at index ${index}.\n` +
            `Response should have an array with ${requestList.length} item(s).`,
        ),
      )
    }
  })
}

function createSingleResponse(
  batchResponse: RelayNetworkLayerResponse,
  json: any,
): RelayNetworkLayerResponse {
  // Fallback for graphql-graphene and apollo-server batch responses
  const data = json.payload || json
  const res = batchResponse.clone()
  res.processJsonData(data)
  return res
}
