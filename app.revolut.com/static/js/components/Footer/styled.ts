import styled from 'styled-components'

import { Link } from '@revolut/rwa-core-components'
import {
  themeColor,
  themeFontSize,
  themeLineHeight,
  themeSpace,
} from '@revolut/rwa-core-styles'

export const StyledFooter = styled.footer`
  color: ${themeColor('footerText')};
  text-align: left;
  font-size: ${themeFontSize('note')};
  line-height: ${themeLineHeight('label')};
  padding-top: ${themeSpace('px56')};
  margin-top: auto;
`

export const FooterLinkText = styled(Link)`
  color: inherit;
  &:hover {
    color: ${themeColor('footerLinkHovered')};
  }
`
