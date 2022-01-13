import * as React from 'react'
import styled from 'styled-components'
import { Box, ButtonBase } from '@revolut/ui-kit'
import { themeGet } from 'styled-system'

export const BannerButtonBase = styled<React.ElementType>(ButtonBase)`
  padding: 0;
  margin-left: 0.5rem;
`
BannerButtonBase.displayName = 'BannerButtonBase'

export const BannerWrapper = styled<React.ElementType>(Box)`
  padding: 1rem 1.25rem;
  border-top: 1px solid ${themeGet('colors.grey-95')};
`
BannerWrapper.displayName = 'BannerWrapper'
