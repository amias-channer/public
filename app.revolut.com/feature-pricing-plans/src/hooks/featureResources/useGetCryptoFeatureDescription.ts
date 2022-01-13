import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { PricingPlanDto, PricingPlanFeature } from '@revolut/rwa-core-types'
import { formatDecimalToPercents } from '@revolut/rwa-core-utils'

import { getPricingPlanProduct } from '../../helpers'
import { I18_NAMESPACE, PricingPlanProductCode } from '../../constants'
import { useGetStandardPricingPlan } from '../api'
import { getFeatureDescriptionKey } from './utils'

const DEFAULT_CRYPTO_FEES = {
  exchange: 0.015,
  standardExchange: 0.025,
}

export const useGetCryptoFeatureDescription = (pricingPlan: PricingPlanDto) => {
  const { t } = useTranslation(I18_NAMESPACE)

  const standardPricingPlan = useGetStandardPricingPlan()

  return useMemo(() => {
    const featureName = PricingPlanFeature.Crypto

    if (!standardPricingPlan) {
      return ''
    }

    const standardCryptoProduct = getPricingPlanProduct(
      standardPricingPlan,
      PricingPlanProductCode.CryptoStandard,
    )

    const currentPlanCryptoProduct = getPricingPlanProduct(
      pricingPlan,
      PricingPlanProductCode.CryptoPremium,
    )

    const standardCryptoExchangeFee =
      standardCryptoProduct?.['fee.pc'] || DEFAULT_CRYPTO_FEES.standardExchange
    const currentPlanCryptoExchangeFee =
      currentPlanCryptoProduct?.['fee.pc'] || DEFAULT_CRYPTO_FEES.exchange

    return t(getFeatureDescriptionKey(featureName), {
      exchangeFee: formatDecimalToPercents(currentPlanCryptoExchangeFee),
      standardExchangeFee: formatDecimalToPercents(standardCryptoExchangeFee),
    })
  }, [pricingPlan, standardPricingPlan, t])
}
