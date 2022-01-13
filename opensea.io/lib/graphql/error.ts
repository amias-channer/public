import { NextPageContext } from "next"
import {
  RRNLRequestError,
  RelayNetworkLayerRequestBatch,
  GraphQLResponseErrors,
} from "react-relay-network-modern"
import {
  captureNoncriticalError,
  captureWarning,
  captureCriticalError,
} from "../analytics/analytics"
import { flatMap } from "../helpers/array"

class GraphQLResponseError extends Error {
  status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.status = status
  }
}

const getRRNLRequestErrorMessages = (error: RRNLRequestError): string[][] => {
  const text = error.res?.text
  if (!text) {
    return [error.res?.errors?.map(e => e.message) || []]
  }
  try {
    const errorData = JSON.parse(text)
    return (
      error.req instanceof RelayNetworkLayerRequestBatch
        ? errorData
        : [errorData]
    ).map(
      (data: { errors?: GraphQLResponseErrors }) =>
        data.errors?.map(e => e.message) || [],
    )
  } catch (_) {
    // ignore
  }
  return []
}

export const getGraphQLResponseErrors = (error: RRNLRequestError) => {
  return flatMap(
    flatMap(getRRNLRequestErrorMessages(error), msgs => msgs),
    msg => {
      try {
        return Object.values(JSON.parse(msg) as Record<string, string[]>).map(
          values => new GraphQLResponseError(values.join(" ")),
        )
      } catch (_) {
        const match = msg.match(/^\[(\d+)\] (.+)/)
        const status = match?.[1]
        const message = match?.[2]
        if (status && message) {
          return [new GraphQLResponseError(message, parseInt(status))]
        }
        return [new GraphQLResponseError(msg)]
      }
    },
  )
}

export const maybeGetGraphQLResponseErrors = <T>(
  error: T,
): GraphQLResponseError[] => {
  return error instanceof RRNLRequestError
    ? getGraphQLResponseErrors(error)
    : []
}

export const getFirstGraphqlResponseErrorMessage = <T>(error: T) => {
  const responses = maybeGetGraphQLResponseErrors(error)
  return responses.length > 0 ? responses[0].message : undefined
}

export const hasGraphQLResponseError = (
  error: any,
  status: number,
  message?: string,
) =>
  getGraphQLResponseErrors(error).some(
    e => e.status === status && (!message || e.message === message),
  )

export const formatRelayError = (error: RRNLRequestError): Error => {
  const requestInfo = (
    error.req instanceof RelayNetworkLayerRequestBatch
      ? error.req.requests
      : [error.req]
  ).map(r => `${r.id}(${JSON.stringify(r.variables, null, 2)})`)
  const responseInfo = getRRNLRequestErrorMessages(error).map(msgs =>
    msgs.join("\n"),
  )
  const wrapper = new Error(
    `${responseInfo
      .filter(info => info)
      .map((resInfo, index) => `${resInfo}\n<- ${requestInfo[index]}`)
      .join(",\n")}`,
  )
  wrapper.name = "RelayError"
  return wrapper
}

export const handleError = async (
  error: RRNLRequestError | unknown,
  login: () => Promise<boolean>,
  logout: () => Promise<unknown>,
  context?: NextPageContext,
): Promise<void> => {
  if (error instanceof RRNLRequestError) {
    const formattedError = formatRelayError(error)
    if (hasGraphQLResponseError(error, 401, "Invalid JWT.")) {
      await logout()
      await login()
    } else if (error.res?.text) {
      // Client-sourced issue
      captureNoncriticalError(formattedError, context || error)
    } else {
      captureWarning(formattedError, context || error)
    }
  } else {
    if (error instanceof Error) {
      captureCriticalError(error, context)
    }
    // Silently ignore non-Error exceptions
  }
}
