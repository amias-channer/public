import { PricingPlanDto } from '@revolut/rwa-core-types'

export const checkIsCardDesignInPricingPlan = ({
  pricingPlan,
  cardDesignBrand,
  cardDesignCode,
}: {
  pricingPlan: PricingPlanDto
  cardDesignBrand: string
  cardDesignCode: string
}) =>
  pricingPlan.cardDesigns.some(
    (pricingPlanCardDesign) =>
      pricingPlanCardDesign.code === cardDesignCode.toLowerCase() &&
      pricingPlanCardDesign.brand === cardDesignBrand.toLowerCase(),
  )
