import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import * as Icons from '@revolut/icons'

import { PricingPlanDto, PricingPlanFeature } from '@revolut/rwa-core-types'

import { checkIsPricingPlanPremiumOrMetal, formatMoneyWithNoDecimal } from '../../helpers'
import { I18_NAMESPACE } from '../../constants'
import { FeatureResources } from './types'
import { getFeatureDescriptionKey, getFeatureTitleKey } from './utils'

const ATM_FREE_PREFIX = 'ATM_FREE'

export const useGetFreeAtmFeatureResources = (pricingPlan: PricingPlanDto) => {
  const { t } = useTranslation(I18_NAMESPACE)

  return useMemo<FeatureResources>(() => {
    if (pricingPlan.isDefault) {
      return null
    }

    const featureName = PricingPlanFeature.FreeAtm

    const atmFreeLimit =
      pricingPlan.products.find((product) => product.code.startsWith(ATM_FREE_PREFIX))
        ?.limit || 0

    const isPremiumOrMetalPlan = checkIsPricingPlanPremiumOrMetal(pricingPlan)

    const defaultTitleKey = getFeatureTitleKey(featureName)

    const title = isPremiumOrMetalPlan
      ? t(`${defaultTitleKey}.${pricingPlan.code.toLowerCase()}`)
      : t(defaultTitleKey)

    return {
      id: featureName,
      icon: Icons.Cash,
      title,
      description: t(getFeatureDescriptionKey(featureName), {
        limit: formatMoneyWithNoDecimal(atmFreeLimit, pricingPlan.currency),
      }),
      isLoading: false,
    }
  }, [pricingPlan, t])
}
