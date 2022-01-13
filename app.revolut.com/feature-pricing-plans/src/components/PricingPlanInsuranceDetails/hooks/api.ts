import { useQuery } from 'react-query'

import { QueryKey } from '@revolut/rwa-core-utils'

import { getPlanInsuranceReviewDetails } from '../../../api'

export const useGetPlanInsuranceReviewDetails = (planId: string) => {
  const { data, isFetching } = useQuery(
    [QueryKey.PlanInsuranceReviewDetails, planId],
    () => getPlanInsuranceReviewDetails(planId),
    {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    },
  )

  return {
    planInsuranceReviewDetails: data,
    planInsuranceReviewDetailsFetching: isFetching,
  }
}
