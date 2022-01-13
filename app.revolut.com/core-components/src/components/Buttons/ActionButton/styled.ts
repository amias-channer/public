import styled from 'styled-components'
import { Button, ButtonProps } from '@revolut/ui-kit'

export const ButtonStyled = styled(Button).attrs<ButtonProps>({
  size: 'sm',
  radius: 'button-sm',
  pl: 'px16',
  pr: 'px16',
})`
  align-self: flex-start;
  width: auto;
`
