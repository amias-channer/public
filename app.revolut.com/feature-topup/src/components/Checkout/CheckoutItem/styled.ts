import styled from 'styled-components'
import { Text } from '@revolut/ui-kit'

export const OriginalDiscountedFee = styled(Text).attrs({
  color: 'grey-tone-50',
})`
  text-decoration: line-through;
  margin-right: 5px;
`
