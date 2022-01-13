import React from "react"

interface Props {
  wrapper: (children: React.ReactNode) => React.ReactElement | null
  condition?: boolean
  children: React.ReactNode
}

const ConditionalWrapper = ({ condition, wrapper, children }: Props) =>
  condition ? wrapper(children) : <>{children}</>

export default ConditionalWrapper
