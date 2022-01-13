import styled from 'styled-components'
import { Flex } from '@revolut/ui-kit'

export const DateInputMaskContainer = styled(Flex)`
  position: absolute;
  left: 0;
  top: 0;
`

export const DateInputMaskHidden = styled.span`
  color: transparent;
`

export const DateInputMaskVisible = styled.span`
  color: gray;
`
