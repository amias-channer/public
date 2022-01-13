import styled from "styled-components"
import { Block, BlockProps } from "../Block"

export type FlexProps = Omit<BlockProps, "display">

export const Flex = styled(Block)<FlexProps>`
  display: flex;
`

export default Flex
