import { initAnalytics } from '@revolut/rwa-core-analytics'
import {
  isStagingOrProductionEnv,
  isProductionEnv,
  isDevelopmentEnv,
} from '@revolut/rwa-core-config'
import { defaultStorage, DefaultStorageKey } from '@revolut/rwa-core-utils'

const DEFAULT_ANALYTICS_HOST_URI = '/analytics'

export const setupAnalytics = () => {
  const deviceId = defaultStorage.getItem(DefaultStorageKey.DeviceId) as string

  initAnalytics(deviceId, {
    useLogger: !isStagingOrProductionEnv(),
    isDev: !isProductionEnv(),
    hostUri: !isDevelopmentEnv() ? DEFAULT_ANALYTICS_HOST_URI : undefined,
  })
}
