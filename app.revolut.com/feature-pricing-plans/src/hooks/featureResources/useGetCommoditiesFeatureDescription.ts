import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { PricingPlanDto, PricingPlanFeature } from '@revolut/rwa-core-types'
import { formatDecimalToPercents } from '@revolut/rwa-core-utils'

import { getPricingPlanProduct } from '../../helpers'
import { I18_NAMESPACE, PricingPlanProductCode } from '../../constants'
import { useGetStandardPricingPlan } from '../api'
import { getFeatureDescriptionKey } from './utils'

const DEFAULT_COMMODITIES_FEES = {
  exchange: 0.0025,
  standardExchange: 0.015,
}

export const useGetCommoditiesFeatureDescription = (pricingPlan: PricingPlanDto) => {
  const { t } = useTranslation(I18_NAMESPACE)

  const standardPricingPlan = useGetStandardPricingPlan()

  return useMemo(() => {
    const featureName = PricingPlanFeature.Gold

    if (!standardPricingPlan) {
      return ''
    }

    const standardCommodityProduct = getPricingPlanProduct(
      standardPricingPlan,
      PricingPlanProductCode.CommodityStandard,
    )

    const currentPlanCommodityProduct = getPricingPlanProduct(
      pricingPlan,
      PricingPlanProductCode.CommodityPremium,
    )

    const standardCommodityExchangeFee =
      standardCommodityProduct?.['fee.pc'] || DEFAULT_COMMODITIES_FEES.standardExchange
    const currentPlanCommodityExchangeFee =
      currentPlanCommodityProduct?.['fee.pc'] || DEFAULT_COMMODITIES_FEES.exchange

    return t(getFeatureDescriptionKey(featureName), {
      exchangeFee: formatDecimalToPercents(currentPlanCommodityExchangeFee),
      standardExchangeFee: formatDecimalToPercents(standardCommodityExchangeFee),
    })
  }, [pricingPlan, standardPricingPlan, t])
}
