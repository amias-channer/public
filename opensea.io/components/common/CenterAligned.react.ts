import styled from "styled-components"
import VerticalAligned, { VerticalAlignedProps } from "./VerticalAligned.react"

export type CenterAlignedProps = Omit<VerticalAlignedProps, "alignItems">

export const CenterAligned = styled(VerticalAligned)<CenterAlignedProps>`
  align-items: center;
`

export default CenterAligned
