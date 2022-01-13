import { PricingPlanDto } from '@revolut/rwa-core-types'
import { Duration } from '@revolut/rwa-core-utils'

export const getPricingPlanFreeTrial = (pricingPlan: PricingPlanDto) =>
  pricingPlan.billing.find((billingItem) => Boolean(billingItem.freeTrial))?.freeTrial

export const getPricingPlanFreeTrialLengthInDays = (pricingPlan: PricingPlanDto) =>
  Duration.fromISO(getPricingPlanFreeTrial(pricingPlan)?.duration).days()
