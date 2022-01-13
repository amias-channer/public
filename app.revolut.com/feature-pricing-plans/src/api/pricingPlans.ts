import axios from 'axios'

import { CurrentPricingPlanDto, PricingPlanDto } from '@revolut/rwa-core-types'

export const getCurrentPricingPlan = async () => {
  const { data: currentPlan } = await axios.get<CurrentPricingPlanDto>(
    '/retail/plans/current',
  )

  return currentPlan
}

export const getPricingPlans = async () => {
  const { data: plans } = await axios.get<PricingPlanDto[]>('/retail/plans')

  return plans
}
