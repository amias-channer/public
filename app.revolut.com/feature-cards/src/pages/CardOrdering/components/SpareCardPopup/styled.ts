import styled from 'styled-components'
import { Flex, Image, Text, Relative } from '@revolut/ui-kit'

export const PopupContent = styled(Flex)`
  flex-direction: column;
  height: 50%;
`

export const PopupTextContent = styled(Text).attrs({
  variant: 'primary',
  use: 'div',
})`
  opacity: 0.8;
  margin-top: -8px;
`

export const PopupCardImageContainer = styled(Relative)`
  flex: 1;
`

export const PopupCardImage = styled(Image)`
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
`
