import { FC } from 'react'
import styled from 'styled-components'

import { Box, BoxProps } from '@revolut/ui-kit'

type ScrollableContainerProps = { isEmpty?: boolean } & BoxProps

export const PopupScrollableContainer = styled<FC<ScrollableContainerProps>>(Box).attrs({
  maxHeight: 'calc(100% - 70px)',
  overflow: 'scroll',
  radius: 'widget',
  bg: 'white',
  my: '16px',
})`
  padding: ${({ isEmpty }) => (isEmpty ? '0px' : '2px')};
`
