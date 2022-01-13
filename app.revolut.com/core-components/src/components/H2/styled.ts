import { FC } from 'react'
import styled from 'styled-components'
import { H2 as UiKitH2, TextBoxProps } from '@revolut/ui-kit'

import { themeFont } from '@revolut/rwa-core-styles'

export const StyledH2 = styled<FC<TextBoxProps>>(UiKitH2)`
  ${themeFont('primary')};
  letter-spacing: -0.025em;
`
