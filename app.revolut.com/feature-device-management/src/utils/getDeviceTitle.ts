import { captureException } from '@sentry/react'

import { DeviceType } from '../types'

export const getDeviceTitle = ({
  type,
  browserModel,
  model,
}: {
  type?: string
  browserModel?: string
  model?: string
}) => {
  switch (type) {
    case DeviceType.Browser:
    case DeviceType.MobileBrowser:
      return browserModel
    case DeviceType.MobileApp:
      return model
    default:
      captureException(new Error(`Unsupported device type: ${type}`))
      return undefined
  }
}
