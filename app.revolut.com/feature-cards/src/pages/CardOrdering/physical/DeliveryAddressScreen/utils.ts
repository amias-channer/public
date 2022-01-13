import isEmpty from 'lodash/isEmpty'

import { DeliveryMethodDto, DeliveryMethodsDto } from '@revolut/rwa-core-types'
import { isFree } from '@revolut/rwa-core-utils'

const checkIfDeliveryMethodFree = (deliveryMethod: DeliveryMethodDto) => {
  return isFree(deliveryMethod.fee)
}

const checkIfOnlyOneDeliveryMethodAvailable = (deliveryMethods?: DeliveryMethodDto[]) => {
  return deliveryMethods?.length === 1
}

export const checkIfOnlyPaidMethodForFreeAvailable = (
  allDeliveryMethods: DeliveryMethodsDto,
) => {
  const { deliveryMethods, upgradableDeliveryMethods } = allDeliveryMethods

  return (
    checkIfOnlyOneDeliveryMethodAvailable(deliveryMethods) &&
    checkIfDeliveryMethodFree(deliveryMethods[0]) &&
    isEmpty(upgradableDeliveryMethods)
  )
}
