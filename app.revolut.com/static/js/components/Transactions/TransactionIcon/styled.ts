import styled from 'styled-components'
import { Box } from '@revolut/ui-kit'

export const ImgStyled = styled.img`
  width: 100%;
  border-radius: 100%;
`

export const ReversableBox = styled(Box)`
  transform: ${({ reversed }) => (reversed ? 'rotate(180deg)' : 'none')};
`
