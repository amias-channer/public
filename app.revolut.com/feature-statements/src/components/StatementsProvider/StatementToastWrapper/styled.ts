import styled from 'styled-components'
import { Fixed } from '@revolut/ui-kit'

import { StatementToastContainerPositions } from './types'

export const ToastContainer = styled(Fixed)<StatementToastContainerPositions>`
  bottom: 96px;
  left: ${(props) => props.leftPosition}px;
  right: ${(props) => props.rightPosition}px;
  display: flex;
  justify-content: center;
`
