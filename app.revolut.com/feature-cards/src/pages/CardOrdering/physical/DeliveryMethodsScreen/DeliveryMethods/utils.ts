import { DeliveryMethodDto, MoneyDto } from '@revolut/rwa-core-types'
import { formatMoneyWhenWholeNumber } from '@revolut/rwa-core-utils'

import { DELIVERY_METHOD_TITLES } from './constants'

export const getDeliveryMethodTitleKey = (deliveryMethod: DeliveryMethodDto) =>
  DELIVERY_METHOD_TITLES[deliveryMethod.name]

export const formatDeliveryPrice = (fee: MoneyDto) =>
  formatMoneyWhenWholeNumber(fee.amount, fee.currency)
