import { FC } from 'react'
import { useTranslation } from 'react-i18next'

import {
  PricingPlansBillingItemDto,
  PricingPlanDto,
  PricingPlansBillingPeriod,
} from '@revolut/rwa-core-types'
import { formatMoney, getCurrentLocale, I18nNamespace } from '@revolut/rwa-core-utils'

import { I18_NAMESPACE } from '../../../constants'
import { ReplacedPrice } from './styled'

type ButtonPriceTextProps = {
  pricingPlan: PricingPlanDto
  billing: PricingPlansBillingItemDto
}

const checkIsAnnualBilling = (billing: PricingPlansBillingItemDto) =>
  billing.period === PricingPlansBillingPeriod.P1y

export const REPLACED_PRICE_TEST_ID = 'replaced-price-test-id'

export const ButtonPriceText: FC<ButtonPriceTextProps> = ({ pricingPlan, billing }) => {
  const { t } = useTranslation([I18_NAMESPACE, I18nNamespace.Common])

  const fullPrice = formatMoney(billing.fee, pricingPlan.currency, getCurrentLocale())

  const buttonTextKey = checkIsAnnualBilling(billing)
    ? 'OrderDialog.annuallyButton.text'
    : 'OrderDialog.monthlyButton.text'

  if (!billing.discount) {
    return <>{t(buttonTextKey, { price: fullPrice })}</>
  }

  const discountedPrice = formatMoney(
    billing.discount.fee,
    pricingPlan.currency,
    getCurrentLocale(),
  )

  return (
    <>
      <ReplacedPrice data-testid={REPLACED_PRICE_TEST_ID}>{fullPrice}</ReplacedPrice>
      {t(buttonTextKey, { price: discountedPrice })}
    </>
  )
}
