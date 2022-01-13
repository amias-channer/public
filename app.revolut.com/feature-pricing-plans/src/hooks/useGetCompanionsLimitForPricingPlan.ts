import * as Sentry from '@sentry/react'

import { PricingPlanDto } from '@revolut/rwa-core-types'
import { useGetSmartDelayConfig } from '@revolut/rwa-core-api'

export const useGetCompanionsLimitForPricingPlan = (pricingPlan: PricingPlanDto) => {
  const { smartDelayConfig, isSmartDelayFetching } = useGetSmartDelayConfig()

  if (!smartDelayConfig || isSmartDelayFetching) {
    return null
  }

  const companionsLimit = smartDelayConfig.planConfigurations.find(
    (planConfiguration) => planConfiguration.planId === pricingPlan.id,
  )?.companionsLimit

  if (!companionsLimit) {
    Sentry.captureException(
      new Error(`smart delay config for plan ${pricingPlan.id} has not found`),
    )

    return null
  }

  return companionsLimit
}
