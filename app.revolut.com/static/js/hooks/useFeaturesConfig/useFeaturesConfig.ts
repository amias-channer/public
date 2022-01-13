import { useCallback } from 'react'

import { useGetUserPortfolio, useGetUserFeatures } from '@revolut/rwa-core-api'
import { useAuthContext } from '@revolut/rwa-core-auth'
import { FeatureKey, UserFeatureName } from '@revolut/rwa-core-config'
import {
  isFeatureActive,
  isRestrictedAccessToken,
  isUserFeatureEnabled,
} from '@revolut/rwa-core-utils'

/**
 * In case of limited access or when user doesn't have a portfolio
 * we can see a "403 FORBIDDEN" error code (data is fetched tho)
 * and should mark config as "ready".
 *
 * TODO: https://revolut.atlassian.net/browse/RWA-1499 (Refactor "useFeaturesConfig" hook)
 */
export const useFeaturesConfig = () => {
  const { user, isAuthorized } = useAuthContext()
  const [userPortfolio, { isFetched: isUserPortfolioFetched }] = useGetUserPortfolio({
    enabled: isAuthorized,
  })
  const { userFeatures, isUserFeaturesFetched } = useGetUserFeatures({
    enabled: isAuthorized,
  })

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
    isFeaturesConfigReady:
      !isAuthorized || Boolean(user && isUserPortfolioFetched && isUserFeaturesFetched),
  }
}
