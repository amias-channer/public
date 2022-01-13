import styled from 'styled-components'
import { Box } from '@revolut/ui-kit'

import { themeColor, themeFontSize } from '@revolut/rwa-core-styles'

export const ErrorMessage = styled(Box)`
  color: ${themeColor('primaryError')};
  font-size: ${themeFontSize('note')};
`
