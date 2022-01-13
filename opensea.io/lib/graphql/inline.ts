import { FragmentRef, GraphQLTaggedNode, readInlineData } from "react-relay"
import type { _RefType } from "relay-runtime"

const isFragmentRef = <T extends _RefType<any>>(
  ref: T | FragmentRef<T>,
): ref is FragmentRef<T> => {
  return "__fragments" in ref
}

export const inlineFragmentize =
  <T extends _RefType<any>, U = T>(
    inlineFragment: GraphQLTaggedNode,
    fmap: (x: T) => U,
  ) =>
  (ref: T | FragmentRef<T>): U => {
    return fmap(
      isFragmentRef(ref) ? readInlineData(inlineFragment, ref) : (ref as T),
    )
  }
