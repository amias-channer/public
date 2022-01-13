import styled from 'styled-components'
import { H1, Text } from '@revolut/ui-kit'

import { themeSpace } from '@revolut/rwa-core-styles'

export const PersonalDetailsTitle = styled(H1)`
  margin-right: ${themeSpace('px24')};
`

export const PersonalDetailsSubtitle = styled(Text).attrs({
  fontSize: 'default',
  lineHeight: 'text',
  color: 'default',
})``
