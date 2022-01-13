import { PricingPlanDto, PricingPlansBillingPeriod } from '@revolut/rwa-core-types'

export const getPricingPlanBillingForPeriod = (
  pricingPlan: PricingPlanDto,
  period: PricingPlansBillingPeriod,
) => pricingPlan.billing.find((billingItem) => billingItem.period === period)

export const getMonthlyBilling = (pricingPlan: PricingPlanDto) =>
  getPricingPlanBillingForPeriod(pricingPlan, PricingPlansBillingPeriod.P1m)
