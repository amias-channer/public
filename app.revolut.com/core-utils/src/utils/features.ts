import {
  FEATURES,
  FeatureKey,
  getEnvByOrigin,
  FeatureArgs as ConfigFeatureArgs,
} from '@revolut/rwa-core-config'

import { getDetectedCountryCode } from './i18n'

type FeatureArgs = Omit<ConfigFeatureArgs, 'env' | 'detectedCountryCode'>

export const isFeatureActive = (key: FeatureKey, featureArgs: FeatureArgs) => {
  const env = getEnvByOrigin()
  const detectedCountryCode = getDetectedCountryCode()

  return FEATURES[key]({
    env,
    detectedCountryCode,
    ...featureArgs,
  })
}
