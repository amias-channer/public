import { PricingPlanDto } from '@revolut/rwa-core-types'

import { useGetCurrentPricingPlan, useGetPricingPlans } from './api'

export const filterPricingPlansByPriority = (
  pricingPlans: PricingPlanDto[],
  comparedPlanPriority: number,
) => {
  return pricingPlans.filter(
    (pricingPlan) =>
      !pricingPlan.isDefault && pricingPlan.priority >= comparedPlanPriority,
  )
}

export const useGetFilteredPricingPlansByPriority = (minPriority?: number) => {
  const { pricingPlans } = useGetPricingPlans()
  const { currentPricingPlan } = useGetCurrentPricingPlan()

  if (!currentPricingPlan || !pricingPlans) {
    return []
  }

  return filterPricingPlansByPriority(
    pricingPlans,
    minPriority ?? currentPricingPlan.priority,
  )
}
