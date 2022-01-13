import maxBy from 'lodash/maxBy'

import {
  InterestRateDto,
  InterestRateType,
  PricingPlanDto,
  ProductPerPlanDto,
} from '@revolut/rwa-core-types'
import { useGetBestDepositProductsPerPlans } from '@revolut/rwa-core-api'
import { getCurrentIntlLocale } from '@revolut/rwa-core-utils'

const formatInterestRate = (rate: number, minimumFractionDigits?: number) => {
  const intl = new Intl.NumberFormat(getCurrentIntlLocale(), {
    minimumFractionDigits,
    maximumFractionDigits: 2,
  })

  return intl.format(rate)
}

const getInterestRateValue = (interestRate: InterestRateDto) => {
  const rate = interestRate.rate
  const type = interestRate.type

  switch (type) {
    case InterestRateType.Aer:
      return formatInterestRate(rate)
    case InterestRateType.Apy:
      return formatInterestRate(rate, 2)
    default:
      throw new Error(`Interest rate type ${type} was not recognised`)
  }
}

export const useGetDepositInterestRateValue = (pricingPlan: PricingPlanDto) => {
  const { bestDepositProductsPerPlans, bestDepositProductsPerPlansFetching } =
    useGetBestDepositProductsPerPlans()

  if (!bestDepositProductsPerPlans || bestDepositProductsPerPlansFetching) {
    return null
  }

  const depositProductsPerPlan = bestDepositProductsPerPlans.filter(
    (depositProductPerPlans: ProductPerPlanDto) =>
      depositProductPerPlans.planIds.includes(pricingPlan.id),
  )

  const interestRate = maxBy<ProductPerPlanDto>(
    depositProductsPerPlan,
    (depositProductPerPlan: ProductPerPlanDto) =>
      depositProductPerPlan.product.depositInfo.interestRate.rate,
  )?.product.depositInfo.interestRate

  if (!interestRate) {
    return null
  }

  return getInterestRateValue(interestRate)
}
