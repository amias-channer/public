import {
  PricingPlanDto,
  PricingPlanFeature,
  PricingPlanFeatureInfo,
  PricingPlansFeatureGroupDto,
  PricingPlansFeatureToggleState,
} from '@revolut/rwa-core-types'

export const mapFeatureGroupFeaturesToState = (
  featureGroup: PricingPlansFeatureGroupDto,
  pricingPlan: PricingPlanDto,
): PricingPlanFeatureInfo[] =>
  featureGroup.features.map((feature) => ({
    name: feature,
    state:
      pricingPlan.featureToggles.find((featureToggle) => featureToggle.name === feature)
        ?.state || PricingPlansFeatureToggleState.Disabled,
  }))

const isFeatureDisabled = (feature: PricingPlanFeatureInfo) =>
  feature.state === PricingPlansFeatureToggleState.Disabled

const isUIFeature = (feature: PricingPlanFeatureInfo) =>
  [
    PricingPlanFeature.PlusUi,
    PricingPlanFeature.PremiumUi,
    PricingPlanFeature.MetalUi,
  ].some((uiFeature) => feature.name === uiFeature)

export const filterFeatures = (featuresWithState: PricingPlanFeatureInfo[]) =>
  featuresWithState.filter(
    (feature) => !isFeatureDisabled(feature) && !isUIFeature(feature),
  )
