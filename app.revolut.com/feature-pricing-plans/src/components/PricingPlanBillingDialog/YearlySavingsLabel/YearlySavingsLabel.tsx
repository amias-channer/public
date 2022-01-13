import { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { PricingPlansBillingItemDto, PricingPlanDto } from '@revolut/rwa-core-types'
import { I18nNamespace } from '@revolut/rwa-core-utils'

import { I18_NAMESPACE } from '../../../constants'
import { getPricingPlanFreeTrialLengthInDays } from '../utils'
import { getAnnuallySavingsPercent } from './utils'

type YearlySavingProps = {
  pricingPlan: PricingPlanDto
  monthlyBilling: PricingPlansBillingItemDto
  annualBilling: PricingPlansBillingItemDto
}

export const YearlySavingsLabel: FC<YearlySavingProps> = ({
  pricingPlan,
  monthlyBilling,
  annualBilling,
}) => {
  const { t } = useTranslation([I18_NAMESPACE, I18nNamespace.Common])

  const savingsPercent = getAnnuallySavingsPercent(monthlyBilling, annualBilling)

  const text = t('OrderDialog.annualBilling.savings', { savingsPercent })

  const freeTrialDays = getPricingPlanFreeTrialLengthInDays(pricingPlan)

  if (!freeTrialDays) {
    return <>{text}</>
  }

  return (
    <>{`${text} ${t('OrderDialog.billing.freeTrial', {
      days: t(`${I18nNamespace.Common}:days`, { count: freeTrialDays }),
    })}`}</>
  )
}
