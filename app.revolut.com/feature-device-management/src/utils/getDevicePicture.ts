import { captureException } from '@sentry/react'

import { getAsset } from '@revolut/rwa-core-utils'

import { DeviceType } from '../types'

export const getDevicePicture = (type?: string) => {
  switch (type) {
    case DeviceType.Browser:
      return getAsset('features/device_management/browser-device-avatar.svg')
    case DeviceType.MobileBrowser:
    case DeviceType.MobileApp:
      return getAsset('features/device_management/mobile-device-avatar.svg')
    default:
      captureException(new Error(`Unsupported device type: ${type}`))
      return undefined
  }
}
