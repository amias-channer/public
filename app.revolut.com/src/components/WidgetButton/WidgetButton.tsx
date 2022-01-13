import * as React from 'react'
import { CircleButton } from '@revolut/ui-kit'

import { ChatOutline, NavigationClose } from './styles'

type Props = {
  isOpen: boolean
  onClick: () => void
}

export const TEST_ID_BUTTON_CHAT = 'TEST_ID_BUTTON_CHAT'

export const WidgetButton = ({ isOpen, onClick }: Props) => (
  <CircleButton
    data-testid={TEST_ID_BUTTON_CHAT}
    elevation={600}
    onClick={onClick}
  >
    <ChatOutline isOpen={isOpen} color='black' />
    <NavigationClose isOpen={isOpen} color='black' />
  </CircleButton>
)
