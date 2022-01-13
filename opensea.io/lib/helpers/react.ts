import React from "react"

export const isReactElementType = <P>(
  element: React.ReactElement,
  type: React.ComponentType<P>,
): element is React.ReactElement<P> => element.type === type
