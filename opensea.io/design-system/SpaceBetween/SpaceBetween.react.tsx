import styled from "styled-components"
import Flex, { FlexProps } from "../../design-system/Flex"

export type SpaceBetweenProps = Omit<FlexProps, "justifyContent">

export const SpaceBetween = styled(Flex)<SpaceBetweenProps>`
  justify-content: space-between;
`

export default SpaceBetween
