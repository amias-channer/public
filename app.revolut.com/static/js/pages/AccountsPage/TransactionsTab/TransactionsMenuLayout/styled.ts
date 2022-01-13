import styled from 'styled-components'
import { Chain } from '@revolut/ui-kit'

export const ChainWithSingleSpaceSeparator = styled(Chain).attrs({
  separator: '',
  space: ' ',
})`
  white-space: pre;
`
