import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import * as Icons from '@revolut/icons'
import * as Sentry from '@sentry/react'

import { PricingPlanDto, PricingPlanFeature } from '@revolut/rwa-core-types'
import { UserFeatureName } from '@revolut/rwa-core-config'
import { useCheckUserFeatureEnabled } from '@revolut/rwa-core-api'

import { I18_NAMESPACE } from '../../constants'
import { useGetCompanionsLimitForPricingPlan } from '../useGetCompanionsLimitForPricingPlan'
import { FeatureResources } from './types'
import { getFeatureDescriptionKey, getFeatureTitleKey } from './utils'

export const useGetSmartDelayFeatureResources = (pricingPlan: PricingPlanDto) => {
  const { t } = useTranslation(I18_NAMESPACE)
  const companionsLimit = useGetCompanionsLimitForPricingPlan(pricingPlan)
  const isSmartDelayEnabled = useCheckUserFeatureEnabled(UserFeatureName.SmartDelay)

  return useMemo<FeatureResources>(() => {
    if (!isSmartDelayEnabled) {
      Sentry.captureException(new Error('smart delay is disabled for the user'))
      return null
    }
    const featureName = PricingPlanFeature.SmartDelay

    return {
      id: featureName,
      icon: Icons.Time,
      title: t(getFeatureTitleKey(featureName)),
      description: companionsLimit
        ? t(getFeatureDescriptionKey(featureName), {
            count: companionsLimit,
            companionsAmount: companionsLimit,
          })
        : '',
      isLoading: false,
    }
  }, [companionsLimit, isSmartDelayEnabled, t])
}
