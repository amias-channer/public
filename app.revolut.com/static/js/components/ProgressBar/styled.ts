import styled from 'styled-components'
import { Box, DURATIONS } from '@revolut/ui-kit'

export const BoxStyled = styled(Box)`
  position: fixed;
  top: 0;
  left: 0;
  transition: width ${DURATIONS.lg};
`
