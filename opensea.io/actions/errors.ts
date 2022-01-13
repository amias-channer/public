import { ServerResponse } from "http"
import { IS_SERVER } from "../constants"
import {
  captureNoncriticalError,
  captureWarning,
} from "../lib/analytics/analytics"
import { trackShowError } from "../lib/analytics/events/errorEvents"
import Router from "../lib/helpers/router"
import { AsyncAction } from "../store"
import * as ActionTypes from "./index"

interface ExternalError {
  message?: string
  code?: number | string
  stack?: string
  error?: ExternalError // For Opera browser
}

enum ErrorType {
  DeniedSignature = "DeniedSignature",
  HeaderNotFound = "HeaderNotFound",
}

const ErrorCodeToErrorType: { [key: string]: ErrorType } = {
  "4001": ErrorType.DeniedSignature, // Metamask, usually
  "-32603": ErrorType.DeniedSignature, // Fortmatic
}

enum ErrorMessagePrefixes {
  HeaderNotFound = "header not found",
  // SDK suppresses error codes
  SDKDeniedSignature = "You declined to authorize",
  SDKDeniedOrderFulfillment = "Failed to authorize transaction",
}

const errorTypeFromMessagePrefix = (message: string): ErrorType | undefined => {
  if (
    message.startsWith(ErrorMessagePrefixes.SDKDeniedSignature) ||
    message.startsWith(ErrorMessagePrefixes.SDKDeniedOrderFulfillment)
  ) {
    return ErrorType.DeniedSignature
  }
  if (message.startsWith(ErrorMessagePrefixes.HeaderNotFound)) {
    return ErrorType.HeaderNotFound
  }
  return undefined
}

const ErrorActions = {
  show(
    errorOrDict: Error | ExternalError,
    customMessage: string | null = null,
  ) {
    return (dispatch: any) => {
      // Error might be a non-Error from an extension
      let error
      let errorType
      try {
        error = _parseError(errorOrDict)

        errorType =
          "code" in errorOrDict && errorOrDict.code
            ? ErrorCodeToErrorType[errorOrDict.code.toString()]
            : errorOrDict.message
            ? errorTypeFromMessagePrefix(errorOrDict.message)
            : undefined
      } catch (parseError) {
        // Fall back
        error =
          error ||
          new Error(
            `Unknown error: ${errorOrDict}. Details: ${parseError.message}`,
          )
      }

      const message = customMessage || error.message

      switch (errorType) {
        case ErrorType.DeniedSignature:
          console.warn(errorOrDict)
          break
        case ErrorType.HeaderNotFound:
          captureWarning(error)
          break
        default: {
          captureNoncriticalError(error)
          dispatch({ type: ActionTypes.SHOW_ERROR, error: message })
          const params = IS_SERVER
            ? { message }
            : { message, path: window.location.pathname }
          trackShowError(params)
          break
        }
      }
    }
  },

  reset() {
    return (dispatch: any) => {
      dispatch({ type: ActionTypes.RESET_ERROR })
    }
  },

  handleNotFound:
    (res?: ServerResponse): AsyncAction<boolean> =>
    async () => {
      if (Router.getPath() === "/404") {
        return false
      }
      return Router.replace("/404", undefined, res)
    },
}

function _parseError(rawError: any): Error {
  if (rawError instanceof Error) {
    return rawError
  }
  if (!(rawError instanceof Object)) {
    return new Error(rawError)
  }
  if ("error" in rawError && rawError.error instanceof Object) {
    // Opera browser
    rawError = rawError.error
  }
  return new Error(rawError.message || JSON.stringify(rawError))
}

export default ErrorActions
