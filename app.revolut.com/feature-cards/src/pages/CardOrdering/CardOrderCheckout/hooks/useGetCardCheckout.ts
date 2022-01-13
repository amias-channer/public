import { useGetPendingCheckouts } from '@revolut/rwa-core-api'
import { FeatureKey } from '@revolut/rwa-core-config'
import { useFeaturesConfig } from '@revolut/rwa-core-navigation'
import { CheckoutType } from '@revolut/rwa-core-types'

export const useGetCardCheckout = () => {
  const { isFeatureActive } = useFeaturesConfig()
  const { pendingCheckouts, isPendingCheckoutsFetching } = useGetPendingCheckouts(
    isFeatureActive(FeatureKey.AllowCardAdding),
  )

  return {
    cardCheckout: pendingCheckouts?.find(
      (pendingCheckout) => pendingCheckout.type === CheckoutType.Card,
    ),
    isPendingCheckoutsFetching,
  }
}
