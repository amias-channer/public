import styled from 'styled-components'
import { Item, themeColor } from '@revolut/ui-kit'

export const ItemStyled = styled(Item)`
  cursor: pointer;

  &:hover {
    background-color: ${themeColor('light-blue-20')};
  }
`
