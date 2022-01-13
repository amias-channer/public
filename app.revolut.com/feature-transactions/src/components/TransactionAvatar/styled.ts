import styled from 'styled-components'
import { Box } from '@revolut/ui-kit'

export const ReversableBox = styled(Box)`
  transform: ${({ reversed }) => (reversed ? 'rotate(180deg)' : 'none')};
`
