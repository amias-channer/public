import { PricingPlanFeature } from '@revolut/rwa-core-types'

export const getFeatureTitleKey = (featureName: PricingPlanFeature) =>
  `feature.${featureName}.title`

export const getFeatureDescriptionKey = (featureName: string) =>
  `feature.${featureName}.description`
