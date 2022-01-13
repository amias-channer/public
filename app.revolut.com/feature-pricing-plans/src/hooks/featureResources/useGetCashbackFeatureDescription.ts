import { useTranslation } from 'react-i18next'

import { PricingPlanDto, PricingPlansCashbackRegion } from '@revolut/rwa-core-types'

import { I18_NAMESPACE } from '../../constants'
import { getFeatureDescriptionKey } from './utils'

export const useGetCashbackFeatureDescription = (pricingPlan: PricingPlanDto) => {
  const { t } = useTranslation(I18_NAMESPACE)
  const { cashback } = pricingPlan

  if (!cashback) {
    return ''
  }

  const cashbackPercent = cashback.largePc || cashback.smallPc

  if (!cashbackPercent) {
    return ''
  }

  if (
    cashback.userRegion === PricingPlansCashbackRegion.Eu &&
    cashback.smallPc !== cashback.largePc
  ) {
    return t(getFeatureDescriptionKey('cashback_different_percentage'), {
      smallPercent: cashback.smallPc,
      largePercent: cashback.largePc,
    })
  }

  return t(getFeatureDescriptionKey('cashback'), {
    percent: cashbackPercent,
  })
}
