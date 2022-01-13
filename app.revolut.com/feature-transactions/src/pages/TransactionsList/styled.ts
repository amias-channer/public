import styled from 'styled-components'
import { Box } from '@revolut/ui-kit'

export const SkeletonsGroup = styled(Box)<{ isShown: boolean }>`
  height: 1px;
  opacity: ${({ isShown }) => (isShown ? '1' : '0')};
`

export const ListGroup = styled(Box)<{ isShown: boolean }>`
  position: relative;
  opacity: ${({ isShown }) => (isShown ? '1' : '0')};
`
