import first from 'lodash/first'
import isEmpty from 'lodash/isEmpty'

import {
  CardFee,
  DeliveryMethodDto,
  DeliveryMethodsDto,
  MoneyDto,
} from '@revolut/rwa-core-types'
import { checkRequired } from '@revolut/rwa-core-utils'

export const getDefaultDeliveryMethod = (
  allDeliveryMethods: DeliveryMethodsDto,
): DeliveryMethodDto => {
  const { deliveryMethods, upgradableDeliveryMethods } = allDeliveryMethods

  if (!isEmpty(upgradableDeliveryMethods)) {
    return checkRequired(
      first(upgradableDeliveryMethods),
      'upgradable delivery method can not be undefined',
    )
  }

  return checkRequired(first(deliveryMethods), 'delivery methods can not be empty')
}

export const getTotalDeliveryAmount = (cardFee: CardFee, deliveryFee: MoneyDto) => {
  return cardFee.amount + deliveryFee.amount
}
