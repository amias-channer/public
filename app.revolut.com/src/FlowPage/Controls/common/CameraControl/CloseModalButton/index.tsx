import React, { FC, MouseEventHandler } from 'react'
import { CircleButton } from '@revolut/ui-kit'
import * as Icons from '@revolut/icons'

type Props = {
  onClick: MouseEventHandler<HTMLButtonElement>
}

export const BUTTON_CLOSE_MODAL_TESTID = 'button-close-modal-testid'

const CloseModalButton: FC<Props> = ({ onClick }) => (
  <CircleButton
    my={{ '*-sm': 's-16', md: 's-24' }}
    mr={{ '*-sm': 's-16', md: 's-24' }}
    ml="auto"
    title="Close"
    onClick={onClick}
    data-testid={BUTTON_CLOSE_MODAL_TESTID}
  >
    <Icons.NavigationClose size={20} />
  </CircleButton>
)

export default CloseModalButton
