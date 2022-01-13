import React, { MutableRefObject, useCallback, useEffect, useRef } from "react"
import { noop } from "lodash"
import {
  QueryRenderer,
  GraphQLTaggedNode,
  useRelayEnvironment,
} from "react-relay"
import { OperationType } from "relay-runtime"
import { IS_SERVER } from "../../constants"
import useAppContext from "../../hooks/useAppContext"
import { handleError } from "./error"
import { GraphQLProps } from "./graphql"

interface Props<TOperation extends OperationType, TProps> {
  component: React.ComponentType<TProps & GraphQLProps<TOperation>>
  handleError: typeof handleError
  props: TProps & Pick<GraphQLProps<TOperation>, "variables">
  query: GraphQLTaggedNode
  ssrData?: TOperation["response"]
}

export const GraphQLRenderer = <TOperation extends OperationType, TProps>({
  component: Component,
  handleError,
  props,
  query,
  ssrData,
}: Props<TOperation, TProps>) => {
  const retryRef = useRef() as MutableRefObject<(() => void) | null>
  const environment = useRelayEnvironment()
  const { login, logout, refetchPublisher } = useAppContext()

  const refetch = useCallback(() => {
    refetchPublisher.publish()
  }, [refetchPublisher])

  useEffect(() => {
    const unsub = refetchPublisher.subscribe(() => retryRef.current?.())
    return () => {
      unsub()
    }
  }, [refetchPublisher])

  return (
    <QueryRenderer<TOperation>
      environment={environment}
      query={query}
      render={({ error, props: data, retry }) => {
        retryRef.current = retry
        if (error) {
          handleError(error, login, logout)
        }

        return (
          <Component
            {...props}
            data={ssrData ?? data}
            error={error}
            refetch={refetch}
          />
        )
      }}
      variables={props.variables ?? {}}
    />
  )
}

export const withData = <TOperation extends OperationType, Props = {}>(
  Component: React.ComponentType<Props & GraphQLProps<TOperation>>,
  query: GraphQLTaggedNode,
) => {
  const WithData = (
    props: Props & Pick<GraphQLProps<TOperation>, "variables">,
  ): React.ReactElement => {
    if (IS_SERVER) {
      return <Component {...props} data={null} error={null} refetch={noop} />
    }

    return (
      <GraphQLRenderer<TOperation, Props>
        component={Component}
        handleError={handleError}
        props={props}
        query={query}
      />
    )
  }
  return WithData
}
