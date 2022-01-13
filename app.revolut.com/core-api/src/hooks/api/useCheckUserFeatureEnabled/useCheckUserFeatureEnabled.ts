import { UserFeatureName } from '@revolut/rwa-core-config'
import { isUserFeatureEnabled } from '@revolut/rwa-core-utils'

import { useGetUserFeatures } from '../useGetUserFeatures'

export const useCheckUserFeatureEnabled = (userFeatureName: UserFeatureName) => {
  const { userFeatures } = useGetUserFeatures()

  if (!userFeatures) {
    return false
  }

  return isUserFeatureEnabled(userFeatures, userFeatureName)
}
