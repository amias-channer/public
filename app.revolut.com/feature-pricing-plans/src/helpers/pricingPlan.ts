import isEmpty from 'lodash/isEmpty'

import {
  PricingPlanCode,
  PricingPlanDto,
  PricingPlanFeature,
  PricingPlansFeatureToggleState,
} from '@revolut/rwa-core-types'

export const isPricingPlanStandard = (pricingPlan: PricingPlanDto) =>
  pricingPlan.code === PricingPlanCode.Standard

export const isPricingPlanPlus = (pricingPlan: PricingPlanDto) =>
  pricingPlan.code === PricingPlanCode.Plus

export const isPricingPlanMetal = (pricingPlan: PricingPlanDto) =>
  pricingPlan.code === PricingPlanCode.Metal

export const isPricingPlanPremium = (pricingPlan: PricingPlanDto) =>
  pricingPlan.code === PricingPlanCode.Premium

export const checkIsPricingPlanPremiumOrMetal = (pricingPlan: PricingPlanDto) =>
  isPricingPlanPremium(pricingPlan) || isPricingPlanMetal(pricingPlan)

export const isCurrentPricingPlanBelowRequired = (
  currentPricingPlan: PricingPlanDto,
  requiredPricingPlan: PricingPlanDto,
) => {
  return currentPricingPlan.priority < requiredPricingPlan.priority
}

export const isPaidPricingPlan = (pricingPlan: PricingPlanDto) =>
  !isEmpty(pricingPlan.billing)

export const getPricingPlanFeatureState = (
  pricingPlan: PricingPlanDto,
  featureName: PricingPlanFeature,
) => {
  const currentFeatureToggle = pricingPlan.featureToggles.find(
    (featureToggle) => featureToggle.name === featureName,
  )

  if (currentFeatureToggle) {
    return currentFeatureToggle.state
  }

  return null
}

export const isPricingPlanFeatureEnabled = (
  pricingPlan: PricingPlanDto,
  featureName: PricingPlanFeature,
) => {
  const currentFeatureState = getPricingPlanFeatureState(pricingPlan, featureName)

  return currentFeatureState === PricingPlansFeatureToggleState.Enabled
}
