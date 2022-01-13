import { FC } from 'react'
import { Cross } from '@revolut/icons'

import { StyledOutlineButton } from './styled'

type BackButtonProps = {
  onClick?: VoidFunction
}

export const CloseButton: FC<BackButtonProps> = (props) => (
  <StyledOutlineButton {...props}>
    <Cross color="textInactive" />
  </StyledOutlineButton>
)
