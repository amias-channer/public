import styled, { keyframes } from 'styled-components'
import { ifProp } from 'styled-tools'
import { Image } from '@revolut/ui-kit'

import { themeRadius } from '@revolut/rwa-core-styles'

export const CARD_WIDTH = 257

export const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`

const fadeInBlockedCard = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 0.5;
  }
`

export const CardImage = styled(Image)<{
  isFrozen: boolean
  isCardDetailsActionsAvailable: boolean
}>`
  border-radius: ${themeRadius('cardImage')};
  width: ${CARD_WIDTH}px;
  opacity: ${ifProp('isFrozen', '0.5', '1')};
  animation: 1s ${ifProp('isFrozen', fadeInBlockedCard, fadeIn)} ease-out;
  cursor: ${ifProp('isCardDetailsActionsAvailable', 'pointer', 'auto')};
`
