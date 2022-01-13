import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@revolut/ui-kit'

import { PricingPlanDto, PricingPlansBillingCode } from '@revolut/rwa-core-types'
import { formatMoney, getCurrentIntlLocale } from '@revolut/rwa-core-utils'

import { I18_NAMESPACE } from '../../../constants'
import { getPlanNameI18nKey } from '../../../helpers'

type PricingPlansModalActionButtonProps = {
  pricingPlan: PricingPlanDto
  onClick: VoidFunction
}

export const PricingPlansModalActionButton: FC<PricingPlansModalActionButtonProps> = ({
  pricingPlan,
  onClick,
}) => {
  const { t } = useTranslation(I18_NAMESPACE)

  const pricingPlanUpgradeFee =
    pricingPlan.billing.find(
      (billingPeriod) => billingPeriod.code === PricingPlansBillingCode.Monthly,
    )?.fee || 0

  return (
    <Button elevated onClick={onClick}>
      {t('modal.button', {
        pricingPlan: t(getPlanNameI18nKey(pricingPlan)),
        fee: formatMoney(
          pricingPlanUpgradeFee,
          pricingPlan.currency,
          getCurrentIntlLocale(),
        ),
      })}
    </Button>
  )
}
