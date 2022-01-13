import { useGetCurrentPricingPlan } from '@revolut/rwa-feature-pricing-plans'

import { useGetPhysicalCardPricing } from '../../../../hooks'

export const useGetPhysicalCardPricingForCurrentPricingPlan = (designCode: string) => {
  const { currentPricingPlan } = useGetCurrentPricingPlan()

  return useGetPhysicalCardPricing({
    cardDesign: designCode,
    planId: currentPricingPlan?.id,
  })
}
