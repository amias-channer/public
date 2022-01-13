import styled from 'styled-components'
import { ifProp } from 'styled-tools'
import { Text } from '@revolut/ui-kit'

export const DeliveryMethodPrice = styled(Text)<{ isReducedPrice?: boolean }>`
  text-decoration: ${ifProp('isReducedPrice', 'line-through')};
`

export const DeliveryMethodPriceFreeLabel = styled(Text).attrs({
  variant: 'secondary',
  color: 'primary',
})`
  text-transform: uppercase;
`
