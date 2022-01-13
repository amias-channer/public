import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import * as Icons from '@revolut/icons'
import * as Sentry from '@sentry/react'

import { PricingPlanDto, PricingPlanFeature } from '@revolut/rwa-core-types'

import { I18_NAMESPACE } from '../../constants'
import { isPricingPlanFeatureEnabled } from '../../helpers'
import { useGetJuniorPricingPlanConfig } from '../useGetJuniorPricingPlanConfig'
import { FeatureResources } from './types'
import { getFeatureDescriptionKey, getFeatureTitleKey } from './utils'

export const useGetJuniorWalletsFeatureResources = (pricingPlan: PricingPlanDto) => {
  const { t } = useTranslation(I18_NAMESPACE)
  const juniorPricingPlanConfig = useGetJuniorPricingPlanConfig(pricingPlan)
  const featureName = PricingPlanFeature.YouthWallets

  const getJuniorWalletDescription = useCallback(() => {
    if (!juniorPricingPlanConfig) {
      return ''
    }

    const juniorAccountsCount = juniorPricingPlanConfig.maxAccountCount

    if (pricingPlan.isDefault) {
      return t(`${getFeatureDescriptionKey(featureName)}.limited_access`, {
        count: juniorAccountsCount,
      })
    }

    return t(`${getFeatureDescriptionKey(featureName)}.text`, {
      juniorAccounts: t(`${getFeatureDescriptionKey(featureName)}.junior_accounts`, {
        count: juniorAccountsCount,
      }),
    })
  }, [featureName, juniorPricingPlanConfig, pricingPlan.isDefault, t])

  return useMemo<FeatureResources>(() => {
    const isJuniorWalletsEnabled = isPricingPlanFeatureEnabled(pricingPlan, featureName)

    if (!isJuniorWalletsEnabled) {
      Sentry.captureException(
        new Error(
          `junior wallets are disabled for the user pricing plan: ${pricingPlan.id}`,
        ),
      )
      return null
    }

    if (!juniorPricingPlanConfig) {
      return { isLoading: true }
    }

    return {
      id: featureName,
      icon: Icons.Backpack,
      title: t(getFeatureTitleKey(featureName)),
      description: getJuniorWalletDescription(),
      isLoading: false,
    }
  }, [featureName, getJuniorWalletDescription, juniorPricingPlanConfig, pricingPlan, t])
}
