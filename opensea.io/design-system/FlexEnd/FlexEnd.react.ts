import styled from "styled-components"
import Flex, { FlexProps } from "../Flex"

export type FlexEndProps = Omit<FlexProps, "justifyContent">

export const FlexEnd = styled(Flex)<FlexEndProps>`
  justify-content: flex-end;
`

export default FlexEnd
