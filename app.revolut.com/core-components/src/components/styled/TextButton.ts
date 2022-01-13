import styled from 'styled-components'
import { TextButton } from '@revolut/ui-kit'

import { BasierCircle, themeColor } from '@revolut/rwa-core-styles'

export const StyledTextButton = styled(TextButton)`
  ${BasierCircle};
  color: ${themeColor('primary')};
  font-weight: 400;
`
