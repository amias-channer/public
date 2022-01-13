import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import * as Icons from '@revolut/icons'

import { UserFeatureName } from '@revolut/rwa-core-config'
import { PricingPlanDto, PricingPlanFeature } from '@revolut/rwa-core-types'
import { useCheckUserFeatureEnabled } from '@revolut/rwa-core-api'

import { I18_NAMESPACE } from '../../constants'
import { useGetDepositInterestRateValue } from '../useGetDepositInterestRateValue'
import { FeatureResources } from './types'
import { getFeatureDescriptionKey, getFeatureTitleKey } from './utils'

export const useGetDepositsFeatureResources = (pricingPlan: PricingPlanDto) => {
  const { t } = useTranslation(I18_NAMESPACE)
  const depositInterestRateValue = useGetDepositInterestRateValue(pricingPlan)
  const isDepositsFeatureEnabled = useCheckUserFeatureEnabled(
    UserFeatureName.VaultsSavings,
  )

  return useMemo<FeatureResources>(() => {
    const featureName = PricingPlanFeature.Deposits

    if (!isDepositsFeatureEnabled || !depositInterestRateValue) {
      return { isLoading: true }
    }

    return {
      id: featureName,
      icon: Icons.SavingsVault,
      title: t(getFeatureTitleKey(featureName)),
      description: t(getFeatureDescriptionKey(featureName), {
        interestRate: depositInterestRateValue,
      }),
      isLoading: false,
    }
  }, [depositInterestRateValue, isDepositsFeatureEnabled, t])
}
