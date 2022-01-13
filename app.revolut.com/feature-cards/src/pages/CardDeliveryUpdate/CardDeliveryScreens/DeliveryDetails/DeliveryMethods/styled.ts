import styled from 'styled-components'
import { ifProp } from 'styled-tools'
import { Card, TextBox } from '@revolut/ui-kit'

import { themeColor, themeFontSize } from '@revolut/rwa-core-styles'

export const CardStyled = styled(Card)`
  border-color: ${ifProp('checked', themeColor('primary'))};
`

export const DeliveryMethodPrice = styled(TextBox)<{ isReducedPrice?: boolean }>`
  text-align: right;
  color: ${ifProp('isReducedPrice', themeColor('cardDeliveryPriceReduced'))};
  text-decoration: ${ifProp('isReducedPrice', 'line-through')};
`

export const DeliveryMethodPriceFreeLabel = styled(TextBox)`
  font-size: ${themeFontSize('smaller')};
  color: ${themeColor('primary')};
  text-transform: uppercase;
  text-align: right;
`
