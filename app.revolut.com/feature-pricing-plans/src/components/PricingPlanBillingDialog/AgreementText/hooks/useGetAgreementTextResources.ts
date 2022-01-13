import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { PricingPlanDto } from '@revolut/rwa-core-types'
import { I18nNamespace } from '@revolut/rwa-core-utils'

import { getPlanNameI18nKey } from '../../../../helpers'
import { I18_NAMESPACE } from '../../../../constants'
import { getPricingPlanFreeTrial, getPricingPlanFreeTrialLengthInDays } from '../../utils'
import { AgreementTextResources } from '../types'
import { getDiscountBilling } from '../utils'
import { useGetLegalTermsUrl } from './useGetLegalTermsUrl'

export const useGetAgreementTextResources = (pricingPlan: PricingPlanDto) => {
  const { t } = useTranslation([I18_NAMESPACE, I18nNamespace.Common])
  const legalTermsUrl = useGetLegalTermsUrl()

  return useMemo<AgreementTextResources>(() => {
    const planName = t(getPlanNameI18nKey(pricingPlan))

    const discountBilling = getDiscountBilling(pricingPlan)

    const freeTrialBilling = getPricingPlanFreeTrial(pricingPlan)

    const termsTitle =
      discountBilling || freeTrialBilling
        ? t('OrderDialog.promotional_terms.title')
        : t('OrderDialog.terms.title')

    if (freeTrialBilling) {
      const freeTrialDaysLength = getPricingPlanFreeTrialLengthInDays(pricingPlan)
      const daysLocalised = t(`${I18nNamespace.Common}:days`, {
        count: freeTrialDaysLength,
      })

      return {
        agreementI18nKey: 'OrderDialog.free_trial_terms.text',
        interpolationValues: {
          days: daysLocalised,
          planName,
          termsTitle,
        },
        termsUrl: freeTrialBilling.termsUrl ?? '',
      }
    }

    if (discountBilling) {
      return {
        agreementI18nKey: 'OrderDialog.promotional_terms.text',
        interpolationValues: {
          planName,
          termsTitle,
        },
        termsUrl: discountBilling.termsUrl ?? '',
      }
    }

    return {
      agreementI18nKey: 'OrderDialog.agreement.text',
      interpolationValues: {
        planName,
        termsTitle,
      },
      termsUrl: legalTermsUrl,
    }
  }, [legalTermsUrl, pricingPlan, t])
}
