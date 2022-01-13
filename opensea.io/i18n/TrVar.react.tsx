import React from "react"

export interface TrVarProps {
  children: React.ReactNode
  example: string
}

// TrVar is used to indicate that its children should not be translated.
// The `example` prop should be a hint for translators. It should make sense in place of the actual contents.
const TrVar = ({ children }: TrVarProps) => <>{children}</>
export default TrVar
