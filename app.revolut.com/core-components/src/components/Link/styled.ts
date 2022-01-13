import styled from 'styled-components'
import { TextButton } from '@revolut/ui-kit'

import { themeColor, themeFontWeight, BasierCircle } from '@revolut/rwa-core-styles'

export const StyledLink = styled(TextButton)`
  ${BasierCircle};
  color: ${themeColor('primary')};
  font-weight: ${themeFontWeight('default')};
  font-size: inherit;
  line-height: 1;
`
