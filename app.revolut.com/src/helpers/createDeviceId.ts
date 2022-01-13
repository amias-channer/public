import { v4 as uuidv4 } from 'uuid'

const TRACKER_DEVICE_ID = 'TRACKER_DEVICE_ID'

export const createDeviceId = (): string => {
  const existingDeviceId = window.localStorage.getItem(TRACKER_DEVICE_ID)

  if (existingDeviceId) {
    return existingDeviceId
  }

  const deviceId = uuidv4()
  window.localStorage.setItem(TRACKER_DEVICE_ID, deviceId)

  return deviceId
}
