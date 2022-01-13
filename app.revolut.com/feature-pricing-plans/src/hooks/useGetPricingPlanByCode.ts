import { PricingPlanCode } from '@revolut/rwa-core-types'

import { useGetPricingPlans } from './api'

export const useGetPricingPlanByCode = (pricingPlanCode: PricingPlanCode) => {
  const { pricingPlans, isPricingPlansFetching } = useGetPricingPlans()

  return {
    isPricingPlansFetching,
    pricingPlan: pricingPlans?.find(
      (pricingPlan) => pricingPlan.code === pricingPlanCode,
    ),
  }
}
