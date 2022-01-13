import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { PricingPlanDto, PricingPlanFeature } from '@revolut/rwa-core-types'
import { useCheckUserFeatureEnabled } from '@revolut/rwa-core-api'
import { UserFeatureName } from '@revolut/rwa-core-config'

import {
  isPricingPlanMetal,
  isPricingPlanPremium,
  formatMoneyWithNoDecimal,
} from '../../helpers'
import { I18_NAMESPACE } from '../../constants'
import { useGetInsuranceCoverCurrency } from '../useGetInsuranceCoverCurrency'
import { INSURANCE_LIMITS } from './constants'
import { getFeatureDescriptionKey } from './utils'

export const useGetFreeInsuranceFeatureDescription = (pricingPlan: PricingPlanDto) => {
  const { t } = useTranslation(I18_NAMESPACE)
  const insuranceCoverCurrency = useGetInsuranceCoverCurrency()
  const isFreeInsuranceFeatureEnabled = useCheckUserFeatureEnabled(
    UserFeatureName.NewEEAInsurance,
  )

  return useMemo(() => {
    const featureName = PricingPlanFeature.FreeInsurance
    const insuranceMoney = formatMoneyWithNoDecimal(
      INSURANCE_LIMITS.travelInsurance.amount,
      insuranceCoverCurrency,
    )

    if (isPricingPlanMetal(pricingPlan) && isFreeInsuranceFeatureEnabled) {
      return t(`${getFeatureDescriptionKey(featureName)}.metal`, {
        insuranceAmount: insuranceMoney,
      })
    }

    if (isPricingPlanPremium(pricingPlan) && isFreeInsuranceFeatureEnabled) {
      return t(`${getFeatureDescriptionKey(featureName)}.premium`, {
        insuranceAmount: insuranceMoney,
      })
    }

    return t(`${getFeatureDescriptionKey(featureName)}.default`)
  }, [insuranceCoverCurrency, isFreeInsuranceFeatureEnabled, pricingPlan, t])
}
