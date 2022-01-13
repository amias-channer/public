import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import * as Icons from '@revolut/icons'
import * as Sentry from '@sentry/react'

import { PricingPlanFeature } from '@revolut/rwa-core-types'

import { I18_NAMESPACE } from '../../constants'
import { formatMoneyWithNoDecimal } from '../../helpers'
import { useGetInsuranceCoverCurrency } from '../useGetInsuranceCoverCurrency'
import { INSURANCE_LIMITS } from './constants'
import { FeatureResources } from './types'
import { getFeatureDescriptionKey, getFeatureTitleKey } from './utils'

export type PurchaseProtectionUpgradedVariant =
  | PricingPlanFeature.PurchaseProtectionVariant1
  | PricingPlanFeature.PurchaseProtectionVariant2
  | PricingPlanFeature.PurchaseProtectionVariant3

export const useCreateGetterForPurchaseProtectionUpgradedFeatureResources = () => {
  const { t } = useTranslation(I18_NAMESPACE)
  const insuranceCoverCurrency = useGetInsuranceCoverCurrency()

  return useCallback(
    (purchaseProtectionVariant: PurchaseProtectionUpgradedVariant): FeatureResources => {
      if (!insuranceCoverCurrency) {
        return { isLoading: true }
      }

      let insuranceMoney
      let daysAmount

      switch (purchaseProtectionVariant) {
        case PricingPlanFeature.PurchaseProtectionVariant1:
          insuranceMoney = formatMoneyWithNoDecimal(
            INSURANCE_LIMITS.purchaseProtectionPlus.amount,
            insuranceCoverCurrency,
          )
          daysAmount = INSURANCE_LIMITS.purchaseProtectionPlus.days
          break
        case PricingPlanFeature.PurchaseProtectionVariant2:
          insuranceMoney = formatMoneyWithNoDecimal(
            INSURANCE_LIMITS.purchaseProtectionPremium.amount,
            insuranceCoverCurrency,
          )
          daysAmount = INSURANCE_LIMITS.purchaseProtectionPremium.days
          break
        case PricingPlanFeature.PurchaseProtectionVariant3:
          insuranceMoney = formatMoneyWithNoDecimal(
            INSURANCE_LIMITS.purchaseProtectionMetal.amount,
            insuranceCoverCurrency,
          )
          daysAmount = INSURANCE_LIMITS.purchaseProtectionMetal.days
          break
        default:
          Sentry.captureException(
            new Error(
              `purchase_protection variant ${purchaseProtectionVariant} is unknown`,
            ),
          )
          break
      }

      if (!insuranceMoney || !daysAmount) {
        return null
      }

      return {
        id: purchaseProtectionVariant,
        icon: Icons.Shopping,
        title: t(getFeatureTitleKey(PricingPlanFeature.PurchaseProtection)),
        description: t(
          `${getFeatureDescriptionKey(
            PricingPlanFeature.PurchaseProtection,
          )}.upgraded_variant`,
          {
            insuranceAmount: insuranceMoney,
            daysAmount,
          },
        ),
        isLoading: false,
      }
    },
    [insuranceCoverCurrency, t],
  )
}
