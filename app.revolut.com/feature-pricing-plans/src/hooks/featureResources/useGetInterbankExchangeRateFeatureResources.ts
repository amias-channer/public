import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import * as Icons from '@revolut/icons'

import { PricingPlanDto, PricingPlanFeature } from '@revolut/rwa-core-types'
import { checkIfFiatCurrency } from '@revolut/rwa-core-utils'

import { I18_NAMESPACE } from '../../constants'
import { getPricingPlanFxLimit } from '../../helpers'
import { useGetSupportedHoldingCurrencies } from '../useGetSupportedHoldingCurrencies'
import { FeatureResources } from './types'
import { getFeatureDescriptionKey, getFeatureTitleKey } from './utils'

export const useGetInterbankExchangeRateFeatureResources = (
  pricingPlan: PricingPlanDto,
) => {
  const { t } = useTranslation(I18_NAMESPACE)
  const supportedHoldingCurrencies = useGetSupportedHoldingCurrencies()

  const fxProductLimit = useMemo(() => getPricingPlanFxLimit(pricingPlan), [pricingPlan])

  return useMemo<FeatureResources>(() => {
    if (!fxProductLimit) {
      return null
    }

    const fiatCurrenciesCount = supportedHoldingCurrencies.filter((currency) =>
      checkIfFiatCurrency(currency),
    ).length

    if (fiatCurrenciesCount === 0) {
      return null
    }

    const featureName = PricingPlanFeature.FreeFx

    return {
      id: featureName,
      icon: Icons.ArrowExchange,
      title: t(getFeatureTitleKey(featureName)),
      description: t(getFeatureDescriptionKey(featureName), {
        fiatCurrenciesCount,
        fxProductLimit,
      }),
      isLoading: false,
    }
  }, [fxProductLimit, supportedHoldingCurrencies, t])
}
