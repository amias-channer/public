import styled from 'styled-components'
import { TextBox } from '@revolut/ui-kit'

type OpacityBoxProps = { disabled?: boolean }

export const OpacityBox = styled(TextBox)<OpacityBoxProps>`
  opacity: ${({ disabled }) => (disabled ? '0.5' : '1')};
`
