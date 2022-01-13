import { OperationType } from "relay-runtime"
import AppComponent from "../../AppComponent.react"
import { GraphQLProps } from "./graphql"

export default class GraphQLComponent<
  TOperation extends OperationType,
  Props = {},
  State = {},
> extends AppComponent<Props & GraphQLProps<TOperation>, State> {
  onDataChange?: () => void

  syncState<K extends keyof State>(
    derive: (data: GraphQLProps<TOperation>["data"]) => Pick<State, K>,
  ): Pick<State, K> {
    this.onDataChange = () => this.setState(derive(this.props.data))
    return derive(this.props.data)
  }

  componentDidUpdate(
    prevProps: Props & GraphQLProps<TOperation>,
    _prevState: State,
  ) {
    if (this.props.data !== prevProps.data) {
      this.onDataChange?.()
    }
  }
}
