import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Text } from '@revolut/ui-kit'

import { PricingPlansBillingItemDto, PricingPlanDto } from '@revolut/rwa-core-types'
import { I18nNamespace } from '@revolut/rwa-core-utils'

import { I18_NAMESPACE } from '../../../constants'
import { getPricingPlanFreeTrialLengthInDays } from '../utils'

type MonthlyBillingPeriodProps = {
  pricingPlan: PricingPlanDto
  monthlyBilling: PricingPlansBillingItemDto
}

export const MonthlyBillingDuration: FC<MonthlyBillingPeriodProps> = ({
  pricingPlan,
  monthlyBilling,
}) => {
  const { t } = useTranslation([I18_NAMESPACE, I18nNamespace.Common])

  const freeTrialDays = getPricingPlanFreeTrialLengthInDays(pricingPlan)
  const periodsCount = monthlyBilling.discount?.periodsCount

  if (!periodsCount) {
    const text = t('OrderDialog.monthBilling.any.duration')

    if (!freeTrialDays) {
      return <>{text}</>
    }

    return (
      <>
        {text}{' '}
        <Text color="blue">
          {t('OrderDialog.billing.freeTrial', {
            days: t(`${I18nNamespace.Common}:days`, { count: freeTrialDays }),
          })}
        </Text>
      </>
    )
  }

  return (
    <>
      {t('OrderDialog.monthBilling.promotion.duration', {
        months: `${periodsCount} ${t(`${I18nNamespace.Common}:months`, {
          count: periodsCount,
        })}`,
      })}
    </>
  )
}
