import { UserFeatureName } from '@revolut/rwa-core-config'
import { UserFeatureDto, UserFeatureState } from '@revolut/rwa-core-types'

export const isUserFeatureEnabled = (
  userFeatures: ReadonlyArray<UserFeatureDto>,
  featureName: UserFeatureName,
) =>
  userFeatures.some(
    (feature) =>
      feature.name === featureName && feature.state === UserFeatureState.Enabled,
  )
