// NOTE: This require will be replaced with `@sentry/browser`
// client side thanks to the webpack config in next.config.js
import { ServerResponse } from "http"
import { Debug, RewriteFrames } from "@sentry/integrations"
import * as Sentry from "@sentry/node"
import type { NextPageContext } from "next"
import { RRNLRequestError } from "react-relay-network-modern"

const IS_SERVER = typeof window === "undefined"
const IS_STAGING =
  process.env.HEROKU_BRANCH !== undefined &&
  process.env.HEROKU_PR_NUMBER !== undefined

const Environment = {
  DEVELOPMENT: "development",
  STAGING: "staging",
  PRODUCTION: "production",
}

const getEnvironment = () => {
  if (process.env.NODE_ENV === "development") {
    return Environment.DEVELOPMENT
  } else if (IS_STAGING) {
    return Environment.STAGING
  } else {
    return Environment.PRODUCTION
  }
}

const getIntegrations = () => {
  const integrations = []
  if (process.env.NODE_ENV !== "production") {
    integrations.push(
      new Debug({
        // set to true to trigger DevTools debugger instead of using console.log
        debugger: false,
      }),
    )
  }

  if (IS_SERVER && process.env.NEXT_PUBLIC_SENTRY_SERVER_ROOT_DIR) {
    // For Node.js, rewrite Error.stack to use relative paths, so that source
    // maps starting with ~/_next map to files in Error.stack with path
    // app:///_next
    console.log(
      `Rewriting frames, NEXT_PUBLIC_SENTRY_SERVER_ROOT_DIR=${process.env.NEXT_PUBLIC_SENTRY_SERVER_ROOT_DIR}`,
    )

    integrations.push(
      new RewriteFrames({
        iteratee: frame => {
          frame.filename = frame.filename?.replace(
            process.env.NEXT_PUBLIC_SENTRY_SERVER_ROOT_DIR ?? "",
            "app:///",
          )
          frame.filename = frame.filename?.replace(".next", "_next")
          return frame
        },
      }),
    )
  }

  return integrations
}

export type CaptureExceptionContext = NextPageContext | RRNLRequestError

type RelayResponse = NonNullable<RRNLRequestError["res"]>

export type ExceptionContextResponse = RelayResponse | ServerResponse | unknown

const isServerResponse = (
  res: ExceptionContextResponse,
): res is ServerResponse => {
  const maybeServerResponse = res as ServerResponse
  return (
    maybeServerResponse.statusCode !== undefined &&
    typeof maybeServerResponse.getHeader === "function"
  )
}

const isRelayResponse = (
  res: ExceptionContextResponse,
): res is RelayResponse => {
  const maybeRelayResponse = res as RelayResponse
  return maybeRelayResponse.status !== undefined
}

const getTraceId = (res: ExceptionContextResponse) => {
  if (isServerResponse(res)) {
    return res.getHeader("x-trace-id")
  } else if (isRelayResponse(res)) {
    return res.headers?.["x-trace-id"]
  }
  return undefined
}

export const init = (
  release: string | undefined = process.env.SENTRY_RELEASE,
) => {
  Sentry.init({
    enabled: process.env.NODE_ENV === "production",
    debug: process.env.NODE_ENV !== "production",
    dsn: process.env.SENTRY_DSN,
    release,
    maxBreadcrumbs: 100,
    maxValueLength: 1024,
    attachStacktrace: true,
    environment: getEnvironment(),
    sampleRate: IS_SERVER ? 1 : 0.1,
    tracesSampleRate: IS_SERVER ? 1 : 0.1,
    integrations: getIntegrations(),
  })

  const captureException = (
    err: Error & { statusCode?: number },
    level: Sentry.Severity = Sentry.Severity.Error,
    ctx: CaptureExceptionContext | undefined = undefined,
  ) => {
    Sentry.configureScope(scope => {
      scope.setTag("ssr", IS_SERVER)

      if (err.statusCode) {
        scope.setExtra("statusCode", err.statusCode)
      }

      if (ctx) {
        const { res, ...errorInfo } = ctx

        if (res) {
          const traceId = getTraceId(res)
          if (traceId) {
            scope.setExtra("x-trace-id", traceId)
            scope.setExtra(
              "x-trace-link",
              `https://app.datadoghq.com/apm/traces?traceID=${traceId}`,
            )
          }

          if (isServerResponse(res)) {
            scope.setExtra("statusCode", res.statusCode)
          } else {
            scope.setExtra("statusCode", res.status)
          }
        }

        if (errorInfo) {
          // Sets query, pathname, url,
          // method, headers, params,
          // and anything else
          Object.keys(errorInfo).forEach(key =>
            scope.setExtra(key, errorInfo[key as keyof typeof errorInfo]),
          )
        }
      }
    })

    Sentry.withScope(scope => {
      scope.setLevel(level)
      return Sentry.captureException(err)
    })
  }

  return { Sentry, captureException }
}

export default init
