import { defaultStorage, DefaultStorageKey } from '@revolut/rwa-core-utils'

import { generateNewDeviceId } from 'utils'

export const setupDeviceId = () => {
  const deviceId = defaultStorage.getItem(DefaultStorageKey.DeviceId)

  if (!deviceId) {
    defaultStorage.setItem(DefaultStorageKey.DeviceId, generateNewDeviceId())
  }
}
