import { PricingPlanDto } from '@revolut/rwa-core-types'
import { formatMoney, getCurrentIntlLocale } from '@revolut/rwa-core-utils'

import { PricingPlanProductCode } from '../constants'

export const formatMoneyWithNoDecimal = (amount: number, currency: string) =>
  formatMoney(amount, currency, getCurrentIntlLocale(), {
    withCurrency: true,
    useGrouping: true,
    noDecimal: amount % 100 === 0,
  })

export const getPricingPlanProduct = (
  pricingPlan: PricingPlanDto,
  productName: PricingPlanProductCode | string,
  productType?: string,
) => {
  if (productType) {
    return pricingPlan.products.find(
      (product) => product.type === productType && product.code === productName,
    )
  }

  return pricingPlan.products.find((product) => product.code === productName)
}

const MINIMUM_SWIFT_TRANSFER_COUNT = 1

export const getMinFreeSwiftTransfersCount = (pricingPlan: PricingPlanDto) => {
  const usdFreeLimit =
    getPricingPlanProduct(pricingPlan, PricingPlanProductCode.SwiftUSDTransfer1Free)
      ?.limit || 0

  const nonUsdFreeLimit =
    getPricingPlanProduct(pricingPlan, PricingPlanProductCode.SwiftNonUSDTransfer1Free)
      ?.limit || 0

  return Math.max(Math.min(usdFreeLimit, nonUsdFreeLimit), MINIMUM_SWIFT_TRANSFER_COUNT)
}

export const getPlanNameI18nKey = (pricingPlan: PricingPlanDto) => {
  const { code: planCode } = pricingPlan

  return `common:plans.${planCode.toLowerCase()}.name`
}

const FX_FREE_PRODUCT_TYPE = 'EXCHANGE'
const FX_FREE_PRODUCT_PREFIX = 'FX_FREE_'

export const getPricingPlanFxLimit = (pricingPlan: PricingPlanDto) => {
  const targetProduct = pricingPlan.products.find(
    (product) =>
      product.type === FX_FREE_PRODUCT_TYPE &&
      product.code.startsWith(FX_FREE_PRODUCT_PREFIX),
  )

  return targetProduct?.limit
}
