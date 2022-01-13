import { UserFeatureName } from '@revolut/rwa-core-config'
import { UserFeatureDto } from '@revolut/rwa-core-types'
import { isUserFeatureEnabled } from '@revolut/rwa-core-utils'

export const isGooglePayAvailable = (userFeatures: ReadonlyArray<UserFeatureDto>) =>
  isUserFeatureEnabled(userFeatures, UserFeatureName.TopUpGooglePay)
