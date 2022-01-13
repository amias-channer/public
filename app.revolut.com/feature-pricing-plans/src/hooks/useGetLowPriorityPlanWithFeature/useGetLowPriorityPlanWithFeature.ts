import last from 'lodash/last'
import sortBy from 'lodash/sortBy'

import { PricingPlanFeature } from '@revolut/rwa-core-types'

import { isPaidPricingPlan, isPricingPlanFeatureEnabled } from '../../helpers'
import { useGetPricingPlans } from '../api'

export const useGetLowPriorityPlanWithFeature = (
  pricingPlanFeature: PricingPlanFeature,
) => {
  const { pricingPlans } = useGetPricingPlans()

  if (!pricingPlans) {
    return null
  }

  const sortedPricingPlans = sortBy(pricingPlans, 'priority')

  return (
    sortedPricingPlans.find(
      (plan) =>
        isPaidPricingPlan(plan) && isPricingPlanFeatureEnabled(plan, pricingPlanFeature),
    ) ?? last(sortedPricingPlans)
  )
}
