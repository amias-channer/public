import { useMemo } from 'react'
import * as Sentry from '@sentry/react'

import { useGetJuniorConfig } from '@revolut/rwa-core-api'
import { JuniorPlanConfigurationDto, PricingPlanDto } from '@revolut/rwa-core-types'

export const useGetJuniorPricingPlanConfig = (pricingPlan: PricingPlanDto) => {
  const { juniorConfig, isJuniorConfigFetching } = useGetJuniorConfig()

  return useMemo(() => {
    if (!juniorConfig || isJuniorConfigFetching) {
      return null
    }

    const pricingPlanConfiguration = juniorConfig?.planConfigurations.find(
      (planConfiguration: JuniorPlanConfigurationDto) =>
        planConfiguration.planId === pricingPlan.id,
    )

    if (!pricingPlanConfiguration) {
      Sentry.captureException(
        new Error(
          `junior plan configuration is not available for the plan ${pricingPlan.id}`,
        ),
      )

      return null
    }

    return pricingPlanConfiguration
  }, [isJuniorConfigFetching, juniorConfig, pricingPlan.id])
}
