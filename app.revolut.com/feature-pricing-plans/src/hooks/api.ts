import { useQuery } from 'react-query'

import { PricingPlanCode } from '@revolut/rwa-core-types'
import { QueryKey } from '@revolut/rwa-core-utils'

import { getCurrentPricingPlan, getPricingPlans } from '../api'

export const useGetPricingPlans = () => {
  const { data, isFetching } = useQuery(QueryKey.PricingPlans, getPricingPlans, {
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  })

  return {
    pricingPlans: data,
    isPricingPlansFetching: isFetching,
  }
}

export const useGetCurrentPricingPlan = () => {
  const { pricingPlans, isPricingPlansFetching } = useGetPricingPlans()
  const { data: currentPlan, isFetching } = useQuery(
    QueryKey.CurrentPricingPlan,
    getCurrentPricingPlan,
    {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    },
  )

  return {
    currentPricingPlan: pricingPlans?.find(
      (pricingPlan) => pricingPlan.id === currentPlan?.id,
    ),
    isCurrentPricingPlanFetching: isPricingPlansFetching || isFetching,
  }
}

export const useGetStandardPricingPlan = () => {
  const { pricingPlans, isPricingPlansFetching } = useGetPricingPlans()

  if (!pricingPlans || isPricingPlansFetching) {
    return null
  }

  return pricingPlans.find((pricingPlan) => pricingPlan.code === PricingPlanCode.Standard)
}

export const useGetPricingPlanById = (planId?: string) => {
  const { pricingPlans } = useGetPricingPlans()

  return pricingPlans?.find((pricingPlan) => pricingPlan.id === planId)
}
