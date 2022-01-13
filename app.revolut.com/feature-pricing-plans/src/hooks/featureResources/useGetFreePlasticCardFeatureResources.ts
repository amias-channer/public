import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import * as Icons from '@revolut/icons'

import { PricingPlanDto, PricingPlanFeature } from '@revolut/rwa-core-types'

import { I18_NAMESPACE } from '../../constants'
import { FeatureResources } from './types'
import { getFeatureDescriptionKey, getFeatureTitleKey } from './utils'

export const useGetFreePlasticCardFeatureResources = (pricingPlan: PricingPlanDto) => {
  const { t } = useTranslation(I18_NAMESPACE)

  return useMemo<FeatureResources>(() => {
    if (!pricingPlan.isDefault) {
      return null
    }

    const featureName = PricingPlanFeature.FreePlasticCard

    return {
      id: featureName,
      icon: Icons.Card,
      title: t(getFeatureTitleKey(featureName)),
      description: t(getFeatureDescriptionKey(featureName)),
      isLoading: false,
    }
  }, [pricingPlan.isDefault, t])
}
