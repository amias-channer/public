import { PricingPlanDto } from '@revolut/rwa-core-types'

export const getDiscountBilling = (pricingPlan: PricingPlanDto) =>
  pricingPlan.billing.find((billingItem) => Boolean(billingItem.discount))?.discount
