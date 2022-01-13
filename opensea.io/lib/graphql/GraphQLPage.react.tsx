import { GraphQLTaggedNode, OperationType } from "relay-runtime"
import GraphQLComponent from "./GraphQLComponent.react"

export default abstract class GraphQLPage<
  TOperation extends OperationType,
  Props = {},
  State = {},
> extends GraphQLComponent<TOperation, Props, State> {
  static query: GraphQLTaggedNode
}
