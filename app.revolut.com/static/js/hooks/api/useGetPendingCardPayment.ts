import { useGetPendingCardPayment as useGetPendingCardPaymentApi } from '@revolut/rwa-core-api'
import { FeatureKey } from '@revolut/rwa-core-config'

import { useFeaturesConfig } from '../useFeaturesConfig'

export const useGetPendingCardPayment = () => {
  const { isFeatureActive } = useFeaturesConfig()
  return useGetPendingCardPaymentApi(isFeatureActive(FeatureKey.AllowCardAdding))
}
