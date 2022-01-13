import { DeliveryMethodDto } from '@revolut/rwa-core-types'
import { checkRequired } from '@revolut/rwa-core-utils'

export const validateDeliveryMethod = (deliveryMethod?: DeliveryMethodDto) =>
  checkRequired(deliveryMethod, 'standard and priority methods can not be empty')
