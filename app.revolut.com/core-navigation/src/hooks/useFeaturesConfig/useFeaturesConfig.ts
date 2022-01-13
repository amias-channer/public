import { useCallback } from 'react'

import { useGetUserPortfolio, useGetUserFeatures } from '@revolut/rwa-core-api'
import { useAuthContext } from '@revolut/rwa-core-auth'
import { FeatureKey, UserFeatureName } from '@revolut/rwa-core-config'
import {
  isFeatureActive,
  isUserFeatureEnabled,
  isRestrictedAccessToken,
} from '@revolut/rwa-core-utils'

// TODO: https://revolut.atlassian.net/browse/RWA-1499
export const useFeaturesConfig = () => {
  const { user, isAuthorized } = useAuthContext()
  const [userPortfolio] = useGetUserPortfolio({ enabled: isAuthorized })
  const { userFeatures } = useGetUserFeatures({ enabled: isAuthorized })

  const isUserFeatureEnabledOverride = useCallback(
    (userFeatureName: UserFeatureName) => {
      if (!userFeatures) {
        return false
      }

      return isUserFeatureEnabled(userFeatures, userFeatureName)
    },
    [userFeatures],
  )

  const isFeatureActiveOverride = useCallback(
    (key: FeatureKey) =>
      isFeatureActive(key, {
        user,
        userPortfolio,
        isLimitedAccess: isRestrictedAccessToken(),
        isUserFeatureEnabled: isUserFeatureEnabledOverride,
      }),
    [user, userPortfolio, isUserFeatureEnabledOverride],
  )

  return {
    isFeatureActive: isFeatureActiveOverride,
  }
}
