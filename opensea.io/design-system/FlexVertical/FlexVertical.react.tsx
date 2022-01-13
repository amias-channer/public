import styled from "styled-components"
import Flex, { FlexProps } from "../Flex"

export type FlexVerticalProps = Omit<FlexProps, "flexDirection">

export const FlexVertical = styled(Flex)<FlexVerticalProps>`
  flex-direction: column;
`

export default FlexVertical
