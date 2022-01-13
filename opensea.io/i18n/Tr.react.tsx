import React from "react"
import useAppContext from "../hooks/useAppContext"
import { flatMap } from "../lib/helpers/array"
import { isReactElementType } from "../lib/helpers/react"
import I18n, { TrNode } from "./i18n"
import TrFragment, { TrFragmentProps } from "./TrFragment.react"

type Child = TrNode | React.ReactElement<TrFragmentProps>

interface Props {
  children: Child | Child[]
}

const Tr = (props: Props) => {
  const { language } = useAppContext()
  const children = props.children as Child | Child[]
  const nodes = flatMap(Array.isArray(children) ? children : [children], node =>
    typeof node === "string"
      ? [node]
      : isReactElementType(node, TrFragment)
      ? node.props.children
      : [node],
  )

  return <>{I18n.tr(language, nodes)}</>
}

export default Tr
