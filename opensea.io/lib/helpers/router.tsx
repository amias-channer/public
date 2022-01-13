import { ServerResponse } from "http"
import React from "react"
import { NextPageContext } from "next"
import { Router as RouterType } from "next-routes"
import { WithRouterProps } from "next/dist/client/with-router"
import _clientRouter, { NextRouter, withRouter } from "next/router"
import qs from "qs"
import { IS_SERVER } from "../../constants"
import API from "../api"
import routes from "../routes"
import { fromArray } from "./object"

type QueryParams = Record<
  string,
  boolean | number | object | string | null | undefined
>

export type WithQuery<Query extends object> = WithRouterProps & {
  query: Partial<Query>
}

const clientRouter = _clientRouter as RouterType

const withQuery = <Props extends object, Query extends object>(
  Component: React.ComponentType<Props & WithQuery<Query>>,
): React.ComponentType<Omit<Props, "query" | "router">> =>
  // @ts-expect-error TODO: description
  withRouter<Props, Query>(props => (
    // @ts-expect-error TODO: description
    <Component {...props} query={(props.router ?? {}).query ?? {}} />
  ))

let router: NextRouter | undefined

const set = (r: NextRouter): void => {
  router = r
}

const get = (): NextRouter | undefined => (IS_SERVER ? router : clientRouter)

const push = (pathname: string, params?: QueryParams): Promise<boolean> =>
  clientRouter.pushRoute(
    `${pathname}${params ? stringifyQueryParams(params) : ""}`,
  )

const pushShallow = (
  pathname: string,
  params?: QueryParams,
): Promise<boolean> =>
  new Promise(resolve =>
    setTimeout(() =>
      resolve(
        clientRouter.pushRoute(
          `${pathname}${params ? stringifyQueryParams(params) : ""}`,
          // @ts-expect-error: pushRoute and shallow are incorrectly documented and typed
          { shallow: true },
        ),
      ),
    ),
  )

const replace = async (
  pathname: string,
  params?: QueryParams,
  response?: ServerResponse,
): Promise<boolean> => {
  const href = `${pathname}${params ? stringifyQueryParams(params) : ""}`
  if (response) {
    response.writeHead(302, { Location: href })
    response.end()
    return true
  }
  return clientRouter.replaceRoute(href)
}

const parseQueryString = (queryString: string): qs.ParsedQs =>
  qs.parse(queryString, {
    arrayLimit: 256,
    ignoreQueryPrefix: true,
  })

const getQueryString = (context?: NextPageContext): string =>
  (context ?? get())?.asPath?.replace(/^[^?]*/, "") ?? ""

const getQueryParams = (context?: NextPageContext): qs.ParsedQs => ({
  ...context?.query,
  ...parseQueryString(getQueryString(context)),
})

const stringifyQueryParams = (params: QueryParams): string =>
  qs.stringify(
    { ...params, embed: getQueryParams().embed },
    { addQueryPrefix: true, arrayFormat: "indices", encodeValuesOnly: true },
  )

export const getMergedQueryString = (params?: QueryParams): string =>
  params
    ? stringifyQueryParams({ ...getQueryParams(), ...params })
    : getQueryString()

const getPath = (context?: NextPageContext): string =>
  ((context ?? get())?.asPath?.match(/^[^?]*/) ?? [])[0] ?? ""

const getPathWithMergedQueryV2 = (
  router: NextRouter,
  params: QueryParams = {},
) => {
  const path = (router.asPath.match(/^[^?]*/) ?? [])[0] ?? ""
  return `${path}${getMergedQueryString(params)}`
}

const getPathWithMergedQuery = (
  params?: QueryParams,
  context?: NextPageContext,
): string => `${getPath(context)}${getMergedQueryString(params ?? {})}`

const getHrefWithMergedQuery = (
  params?: QueryParams,
  context?: NextPageContext,
): string => `${API.getWebUrl()}${getPathWithMergedQuery(params, context)}`

const getHrefWithFilteredQuery = (
  keys: string[],
  context?: NextPageContext,
): string => {
  const params = getQueryParams()
  return `${API.getWebUrl()}${getPath(context)}${stringifyQueryParams(
    fromArray(keys.map(k => [k, params[k]])),
  )}`
}

const getPathParams = (
  context?: NextPageContext,
): Record<string, string | undefined> =>
  routes.match(getPath(context)).params ?? {}

const getRouteName = (context?: NextPageContext): string =>
  routes.match(getPath(context)).route?.name ?? ""

const updateQueryParams = (
  params: QueryParams,
  context?: NextPageContext,
): Promise<boolean> =>
  pushShallow(getPath(context), { ...getQueryParams(), ...params })

const replaceQueryParams = (
  params: QueryParams,
  context?: NextPageContext,
): Promise<boolean> => pushShallow(getPath(context), params)

const prefetch = clientRouter.prefetchRoute

type Subscription = (handler: (route: string) => unknown) => () => void

const onEvent =
  (event: string): Subscription =>
  handler => {
    clientRouter.events.on(event, handler)
    return () => clientRouter.events.off(event, handler)
  }

const onChange: Subscription = onEvent("routeChangeComplete")

const onError: Subscription = onEvent("routeChangeError")

const onStart: Subscription = onEvent("routeChangeStart")

const Router = {
  getHrefWithFilteredQuery,
  getHrefWithMergedQuery,
  getMergedQueryString,
  getPath,
  getPathParams,
  getPathWithMergedQuery,
  getPathWithMergedQueryV2,
  getQueryParams,
  getRouteName,
  onChange,
  onError,
  onStart,
  parseQueryString,
  prefetch,
  push,
  pushShallow,
  replace,
  replaceQueryParams,
  set,
  stringifyQueryParams,
  updateQueryParams,
  withQuery,
}
export default Router
