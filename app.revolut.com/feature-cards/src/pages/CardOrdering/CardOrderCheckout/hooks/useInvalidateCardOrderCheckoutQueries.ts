import { useQueryClient } from 'react-query'

import { QueryKey } from '@revolut/rwa-core-utils'

export const useInvalidateCardOrderCheckoutQueries = () => {
  const queryClient = useQueryClient()

  return async () => {
    await queryClient.invalidateQueries(QueryKey.Cards)
    await queryClient.invalidateQueries(QueryKey.Wallet)
    await queryClient.invalidateQueries(QueryKey.CurrentPricingPlan)
  }
}
