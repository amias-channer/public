import React from "react"
import {
  Container,
  createFragmentContainer as makeFragmentContainer,
  createPaginationContainer as makePaginationContainer,
  createRefetchContainer as makeRefetchContainer,
  GraphQLTaggedNode,
  RelayProp,
} from "react-relay"
import {
  OperationType,
  fetchQuery,
  commitMutation,
  MutationConfig,
  MutationParameters,
  Environment,
} from "relay-runtime"
import Auth from "../auth"
import { MapNonNullable } from "../helpers/type"
import { FetchConfig, getEnvironment } from "./environment"
import { withCache } from "./environment/middlewares/cacheMiddleware"
import { handleError } from "./error"

export { graphql } from "react-relay"

export interface RefetchOptions {
  force?: boolean
  fetchPolicy?: "store-or-network" | "network-only"
}

export type Connection<T extends object> =
  | {
      readonly edges: ReadonlyArray<{ readonly node: T | null } | null>
    }
  | null
  | undefined

export type Node<T extends Connection<object>> = NonNullable<
  NonNullable<NonNullable<T>["edges"][number]>["node"]
>

interface BaseGraphQLProps<TOperation extends OperationType> {
  cacheMaxAge?: number
  refetch: () => void
  variables: MapNonNullable<TOperation["variables"]>
}

export interface GraphQLProps<TOperation extends OperationType>
  extends BaseGraphQLProps<TOperation> {
  data: TOperation["response"] | null
  error: Error | null
}

export interface LoadedGraphQLProps<TOperation extends OperationType>
  extends BaseGraphQLProps<TOperation> {
  data: TOperation["response"]
}

export type GraphQLInitialProps<
  TOperation extends OperationType,
  Props = {},
> = Props &
  Pick<GraphQLProps<TOperation>, "variables"> &
  Pick<GraphQLProps<TOperation>, "cacheMaxAge">

// refetchify() adds these props to the component.
// The component's `this.props` will have the type `Props & RefetchProps<FooQuery>`
export interface RefetchProps<TOperation extends OperationType> {
  refetch: (
    variables?:
      | Partial<TOperation["variables"]>
      | ((
          fragmentVariables: TOperation["variables"],
        ) => Partial<TOperation["variables"]>),
    options?: {
      renderVariables?: Partial<TOperation["variables"]> | null
    } & RefetchOptions,
  ) => Promise<void>
}

export interface PageProps {
  hasMore: () => boolean
  isLoading: () => boolean
  loadMore: (count: number, options?: RefetchOptions | null) => Promise<void>
}

// paginate() adds these props to the component.
// The component's `this.props` will have the type `Props & PaginationProps<FooQuery>`
export interface PaginationProps<TOperation extends OperationType> {
  page: PageProps
  refetch: (
    count: number,
    variables?: Omit<TOperation["variables"], "count" | "cursor"> | null,
    options?: { force?: boolean },
  ) => Promise<void>
}

export const getNodes = <T extends object>(
  connection: Connection<T>,
): Array<Node<Connection<T>>> => {
  if (!connection) {
    return []
  }
  return connection.edges
    .map(edge => edge && edge.node)
    .filter((x): x is NonNullable<T> => x !== null)
}

export const getFirstNode = <T extends object>(
  connection: Connection<T>,
): Node<Connection<T>> | undefined => getNodes(connection)[0]

export const fragmentize = <Props extends object>(
  Component: React.ComponentType<Props & { relay?: RelayProp }>,
  { fragments }: { fragments: Record<string, GraphQLTaggedNode> },
): Container<Props> => makeFragmentContainer(Component, fragments)

export const refetchify = <TOperation extends OperationType, Props>(
  Component: React.ComponentType<Props & RefetchProps<TOperation>>,
  {
    fragments = {},
    query,
  }: {
    fragments?: Record<string, GraphQLTaggedNode>
    query: GraphQLTaggedNode
  },
): Container<Props> =>
  makeRefetchContainer<Props>(
    props => (
      <Component
        {...props}
        refetch={(variables, options) =>
          new Promise((resolve, reject) =>
            props.relay.refetch(
              variables || {},
              options?.renderVariables,
              error => (error ? reject(error) : resolve()),
              options,
            ),
          )
        }
      />
    ),
    fragments,
    query,
  )

export const paginate = <TOperation extends OperationType, Props>(
  Component: React.ComponentType<Props & PaginationProps<TOperation>>,
  {
    // connectionConfig,
    fragments,
    query,
  }: {
    // connectionConfig?: Partial<ConnectionConfig<Props>>
    fragments: Record<string, GraphQLTaggedNode>
    query: GraphQLTaggedNode
  },
): Container<Props> =>
  makePaginationContainer<Props>(
    props => (
      <Component
        {...props}
        page={{
          hasMore: props.relay.hasMore,
          isLoading: props.relay.isLoading,
          loadMore: (count, options) =>
            new Promise((resolve, reject) =>
              props.relay.loadMore(
                count,
                error => (error ? reject(error) : resolve()),
                options,
              ),
            ),
        }}
        refetch={(count, variables, options) => {
          const fn = () =>
            new Promise<void>((resolve, reject) =>
              props.relay.refetchConnection(
                count,
                error => (error ? reject(error) : resolve()),
                variables,
              ),
            )
          return options?.force ? fn() : withCache(fn)
        }}
      />
    ),
    fragments,
    {
      getVariables(_props, paginationInfo, fragmentVariables) {
        return {
          ...fragmentVariables,
          ...paginationInfo,
        }
      },
      // ...connectionConfig,
      query,
    },
  )

/*
 * This function should almost never be used directly client-side.
 * It's not tied to the React context and therefore doesn't handle e.g. authentication.
 * Please use AppComponent#context.mutate() instead.
 */
export const mutateGlobal = async <TOperation extends MutationParameters>(
  mutation: GraphQLTaggedNode,
  variables: TOperation["variables"],
  login: typeof Auth.UNSAFE_login = Auth.UNSAFE_login,
  logout: typeof Auth.logout = Auth.logout,
  updater?: MutationConfig<TOperation>["updater"],
): Promise<TOperation["response"]> => {
  try {
    return await new Promise((resolve, reject) =>
      commitMutation(getEnvironment(), {
        mutation,
        variables,
        onCompleted: (response, errors) =>
          errors ? reject(errors) : resolve(response),
        onError: reject,
        updater,
      }),
    )
  } catch (error) {
    handleError(error, login, logout)
    throw error
  }
}

export const fetch = async <TOperation extends OperationType>(
  query: GraphQLTaggedNode,
  variables: TOperation["variables"],
  networkCacheConfig?: FetchConfig,
  environment?: Environment,
): Promise<TOperation["response"]> => {
  try {
    const result = fetchQuery(
      environment ?? getEnvironment(),
      query,
      variables,
      { networkCacheConfig },
    )
    return await result.toPromise()
  } catch (error) {
    // TODO: this should use login/logout from app context
    handleError(error, Auth.UNSAFE_login, Auth.logout)
    throw error
  }
}

export const pkFromRelayId = (relayId: string) => {
  const globalId = Buffer.from(relayId, "base64").toString("binary")
  return Number(globalId.split(":")[1])
}
