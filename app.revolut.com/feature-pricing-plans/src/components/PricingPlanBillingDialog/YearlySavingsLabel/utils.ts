import { PricingPlansBillingItemDto } from '@revolut/rwa-core-types'

const MONTHS_IN_ONE_YEAR = 12

const getMonthlyTotalPrice = (monthlyBilling: PricingPlansBillingItemDto) => {
  const { discount } = monthlyBilling

  if (!discount) {
    return monthlyBilling.fee * MONTHS_IN_ONE_YEAR
  }

  const discountedMonthCount = discount.periodsCount
    ? Math.min(discount.periodsCount, MONTHS_IN_ONE_YEAR)
    : MONTHS_IN_ONE_YEAR

  const fullPriceMonthCount = MONTHS_IN_ONE_YEAR - discountedMonthCount

  return discount.fee * discountedMonthCount + monthlyBilling.fee * fullPriceMonthCount
}

const getYearlyTotalPrice = (annualBilling: PricingPlansBillingItemDto) => {
  const { discount } = annualBilling

  if (!discount) {
    return annualBilling.fee
  }

  return discount.fee
}

export const getAnnuallySavingsPercent = (
  monthlyBilling: PricingPlansBillingItemDto,
  annualBilling: PricingPlansBillingItemDto,
) => {
  const monthlyTotalPrice = getMonthlyTotalPrice(monthlyBilling)
  const yearlyTotalPrice = getYearlyTotalPrice(annualBilling)

  const delta = monthlyTotalPrice - yearlyTotalPrice

  return `${Math.floor((delta * 100) / monthlyTotalPrice)}%`
}
