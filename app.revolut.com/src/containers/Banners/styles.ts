import * as React from 'react'
import { Flex } from '@revolut/ui-kit'
import styled from 'styled-components'
import { themeGet } from 'styled-system'

export const LocalSupportBanner = styled<React.ElementType>(Flex)`
  width: 100%;
  flex-direction: column;
  border-top: 1px solid ${themeGet('colors.grey-95')};
  padding: 1rem;
`
LocalSupportBanner.displayName = 'LocalSupportBanner'
