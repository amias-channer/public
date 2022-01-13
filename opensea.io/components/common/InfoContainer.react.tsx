import styled from "styled-components"
import Flex, { FlexProps } from "../../design-system/Flex"

const InfoContainer = styled(Flex)<FlexProps>`
  width: fit-content;
  align-items: center;
  border-radius: 5px;
  flex-wrap: wrap;
  border: 1px solid ${props => props.theme.colors.border};
`
export default InfoContainer
