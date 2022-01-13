import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import * as Icons from '@revolut/icons'

import { PricingPlanDto, PricingPlanFeature } from '@revolut/rwa-core-types'
import { formatMoney, getCurrentIntlLocale } from '@revolut/rwa-core-utils'

import { getPricingPlanProduct } from '../../helpers'
import { I18_NAMESPACE, PricingPlanProductCode } from '../../constants'
import { FeatureResources } from './types'
import { getFeatureDescriptionKey, getFeatureTitleKey } from './utils'

const CROSS_BORDER_TRANSFER_TYPE = 'CROSS_BORDER_TRANSFER'

export const useGetFreeCrossBorderTransfersFeatureResources = (
  pricingPlan: PricingPlanDto,
) => {
  const { t } = useTranslation(I18_NAMESPACE)

  return useMemo<FeatureResources>(() => {
    const hasFirstTransferForFree = Boolean(
      getPricingPlanProduct(
        pricingPlan,
        PricingPlanProductCode.CrossBorderTransfer1Free,
        CROSS_BORDER_TRANSFER_TYPE,
      ),
    )

    const paidProduct = getPricingPlanProduct(
      pricingPlan,
      PricingPlanProductCode.CrossBorderTransferPaid,
      CROSS_BORDER_TRANSFER_TYPE,
    )

    const fee = paidProduct?.absoluteFee

    if (!hasFirstTransferForFree || !fee) {
      return { isLoading: true }
    }

    const feeMoney = formatMoney(fee.amount, fee.currency, getCurrentIntlLocale())

    const featureName = PricingPlanFeature.FreeCrossBorderTransfers

    return {
      id: featureName,
      icon: Icons.ArrowsPayments,
      title: t(getFeatureTitleKey(featureName)),
      description: t(getFeatureDescriptionKey(featureName), {
        fee: feeMoney,
      }),
      isLoading: false,
    }
  }, [pricingPlan, t])
}
