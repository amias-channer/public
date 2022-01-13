import styled from 'styled-components'
import * as Icons from '@revolut/icons'
import { Box } from '@revolut/ui-kit'

import { transition } from '../../constants/timings'

export const ChatOutline = styled<any>(Icons.ChatOutline)`
  transition: all 0.2s linear;
  position: relative;
  top: 0.75rem;
  opacity: ${({ isOpen }) => (isOpen ? 0 : 1)};
`

export const NavigationClose = styled<any>(Icons.NavigationClose)`
  transition: all ${transition(transition.INTERVALS.LG)};
  position: relative;
  top: -0.75rem;
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
`

export const ButtonBadgeWrapper = styled<React.ElementType>(Box)`
  position: absolute;
  right: 0;
  top: 0;
`
