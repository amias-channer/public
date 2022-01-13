import React, { FC, MouseEventHandler } from 'react'
import { ButtonBase } from '@revolut/ui-kit'
import * as Icons from '@revolut/icons'
import styled from 'styled-components'

type Props = {
  disabled?: boolean
  onClick: MouseEventHandler<HTMLButtonElement>
}

const Button = styled(ButtonBase)`
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  margin-left: -2px;
`

export const BUTTON_BACK_TESTID = 'button-back-testid'

const icon = <Icons.ArrowThinLeft size={24} color="black" />

const BackButton: FC<Props> = ({ disabled, onClick }) => (
  <Button
    onClick={onClick}
    disabled={disabled}
    title="Previous question"
    data-testid={BUTTON_BACK_TESTID}
  >
    {icon}
  </Button>
)

export default BackButton
