import styled from 'styled-components'
import { Flex, Media } from '@revolut/ui-kit'

import { transition } from '../../constants/timings'

export const ButtonFlexContainer = styled<React.ElementType>(Flex).attrs({
  as: 'button',
  bg: 'transparent',
  width: '100%',
  alignItems: 'flex-end',
})`
  border: none;
  text-align: left;
  cursor: pointer;
  outline: none;
  transition: background-color ${transition(transition.INTERVALS.SM)};
  &:hover {
    background-color: ${({ theme }) => theme.colors['grey-100']};
  }
`
ButtonFlexContainer.displayName = 'ButtonFlexContainer'

export const TicketContentBlock = styled<React.ElementType>(Media.Side)`
  overflow: hidden;
`
TicketContentBlock.displayName = 'TicketContentBlock'
