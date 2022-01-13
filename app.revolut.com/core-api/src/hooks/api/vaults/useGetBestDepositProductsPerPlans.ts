import { useQuery } from 'react-query'

import { QueryKey } from '@revolut/rwa-core-utils'

import { getBestDepositProductsPerPlans } from '../../../api'

export const useGetBestDepositProductsPerPlans = () => {
  const { data, isFetching } = useQuery(
    QueryKey.DepositProductsPerPlans,
    getBestDepositProductsPerPlans,
    {
      staleTime: Infinity,
    },
  )

  return {
    bestDepositProductsPerPlans: data,
    bestDepositProductsPerPlansFetching: isFetching,
  }
}
