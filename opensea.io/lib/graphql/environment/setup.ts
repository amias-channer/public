import {
  Middleware,
  MiddlewareSync,
  RelayNetworkLayer,
} from "react-relay-network-modern"
import { Environment, RecordSource, Store } from "relay-runtime"
import { getRelaySerializedState } from "../ssr/serialized_state"

export const createServerEnvironment = (
  middleware: (Middleware | MiddlewareSync | null)[],
) => {
  return new Environment({
    store: new Store(new RecordSource()),
    network: new RelayNetworkLayer(middleware),
  })
}

export const createClientEnvironment = (
  middleware: (Middleware | MiddlewareSync | null)[],
) => {
  return new Environment({
    store: new Store(new RecordSource(getRelaySerializedState()?.records)),
    network: new RelayNetworkLayer(middleware),
  })
}
