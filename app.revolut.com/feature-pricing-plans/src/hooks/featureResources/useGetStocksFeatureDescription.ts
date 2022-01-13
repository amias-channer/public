import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import * as Sentry from '@sentry/react'

import { PricingPlanDto, PricingPlanFeature } from '@revolut/rwa-core-types'

import { getPricingPlanProduct } from '../../helpers'
import { I18_NAMESPACE, PricingPlanProductCode } from '../../constants'
import { useGetStandardPricingPlan } from '../api'
import { getFeatureDescriptionKey } from './utils'

const DEFAULT_STANDARD_PLAN_TRADES_COUNT = 3

export const useGetStocksFeatureDescription = (pricingPlan: PricingPlanDto): string => {
  const { t } = useTranslation(I18_NAMESPACE)

  const standardPricingPlan = useGetStandardPricingPlan()

  const getStandardPricingPlanFreeTradesLimit = useCallback(() => {
    if (!standardPricingPlan) {
      return DEFAULT_STANDARD_PLAN_TRADES_COUNT
    }

    const standardPlanFreeTradesLimit = getPricingPlanProduct(
      standardPricingPlan,
      PricingPlanProductCode.FreeStockTrade,
    )?.limit

    if (!standardPlanFreeTradesLimit) {
      Sentry.captureException(
        new Error('stock trades limit for standard plan is not available'),
      )

      return DEFAULT_STANDARD_PLAN_TRADES_COUNT
    }

    return standardPlanFreeTradesLimit
  }, [standardPricingPlan])

  return useMemo(() => {
    const featureName = PricingPlanFeature.Stocks

    const freeTradesProduct = getPricingPlanProduct(
      pricingPlan,
      PricingPlanProductCode.FreeStockTrade,
    )

    if (!freeTradesProduct) {
      return ''
    }

    const freeTradesLimit = freeTradesProduct.limit

    if (!freeTradesLimit) {
      return t(`${getFeatureDescriptionKey(featureName)}.metal`)
    }

    const standardPlanFreeTradesLimit = getStandardPricingPlanFreeTradesLimit()

    if (freeTradesLimit > standardPlanFreeTradesLimit) {
      return t(`${getFeatureDescriptionKey(featureName)}.premium`, {
        commissionFreeTrades: t('feature.stocks.commission_free', {
          count: freeTradesLimit,
        }),
        standardPlanLimit: standardPlanFreeTradesLimit,
      })
    }

    return t(`${getFeatureDescriptionKey(featureName)}.default`, {
      commissionFreeTrades: t('feature.stocks.commission_free', {
        count: freeTradesLimit,
      }),
    })
  }, [getStandardPricingPlanFreeTradesLimit, pricingPlan, t])
}
