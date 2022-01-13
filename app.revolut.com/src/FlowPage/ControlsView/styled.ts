import { Box, mq } from '@revolut/ui-kit'
import styled from 'styled-components'
import { ifProp } from 'styled-tools'

export const ContainerStyled = styled(Box)`
  flex-grow: 1;
  opacity: 1;
  display: flex;
  pointer-events: all;
`

export const OuterWrapper = styled(Box)`
  width: 100%;
  padding-bottom: 4rem;
  max-width: 768px;
`

export const ControlItemStyled = styled(Box)<{ fullWidth?: boolean }>`
  max-width: ${ifProp('fullWidth', '100%', '33.5rem')};

  @media ${mq('md-*')} {
    margin: 0;
  }
`
