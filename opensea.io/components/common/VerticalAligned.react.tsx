import styled from "styled-components"
import FlexVertical, {
  FlexVerticalProps,
} from "../../design-system/FlexVertical"

export type VerticalAlignedProps = Omit<FlexVerticalProps, "justifyContent">

export const VerticalAligned = styled(FlexVertical)<VerticalAlignedProps>`
  justify-content: center;
`

export default VerticalAligned
