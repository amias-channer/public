import React from "react"
import { TrNode } from "./i18n"

export interface TrFragmentProps {
  children: TrNode[]
}

const TrFragment = ({ children }: TrFragmentProps) => <>{children}</>
export default TrFragment
