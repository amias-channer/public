import { useTranslation } from 'react-i18next'

import { PricingPlanDto, PricingPlanFeature } from '@revolut/rwa-core-types'

import { I18_NAMESPACE } from '../../constants'
import { getMinFreeSwiftTransfersCount } from '../../helpers'
import { getFeatureDescriptionKey } from './utils'

export const useGetGlobalMoneyTransfersFeatureDescription = (
  pricingPlan: PricingPlanDto,
) => {
  const { t } = useTranslation(I18_NAMESPACE)

  const featureName = PricingPlanFeature.GlobalMoneyTransfers
  const freeTransferCount = getMinFreeSwiftTransfersCount(pricingPlan)

  return t(`${getFeatureDescriptionKey(featureName)}.text`, {
    swiftQuantity: t(`${getFeatureDescriptionKey(featureName)}.swiftQuantity`, {
      count: freeTransferCount,
    }),
  })
}
