import { useTranslation } from 'react-i18next'

import { PricingPlanDto, PricingPlanFeature } from '@revolut/rwa-core-types'

import { isPricingPlanMetal } from '../../helpers'
import { I18_NAMESPACE } from '../../constants'
import { INSURANCE_LIMITS } from './constants'
import { getFeatureDescriptionKey } from './utils'

export const useGetDiscountDeviceInsuranceFeatureDescription = (
  pricingPlan: PricingPlanDto,
) => {
  const { t } = useTranslation(I18_NAMESPACE)

  const featureName = PricingPlanFeature.DiscountDeviceInsurance
  const discountPercentage = `${INSURANCE_LIMITS.deviceInsurance.discountPercentage}%`

  return t(
    `${getFeatureDescriptionKey(featureName)}${
      isPricingPlanMetal(pricingPlan) ? '.metal' : '.default'
    }`,
    {
      discountAmount: discountPercentage,
    },
  )
}
