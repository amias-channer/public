import { DeliveryMethodName } from '@revolut/rwa-core-types'

export const DELIVERY_METHOD_TITLES = {
  [DeliveryMethodName.Standard]:
    'CardOrdering.DeliveryDetailsScreen.deliveryMethod.standard',
  [DeliveryMethodName.Priority]:
    'CardOrdering.DeliveryDetailsScreen.deliveryMethod.priority',
}
