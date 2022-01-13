import { encodeDeviceId } from './encodeDeviceId'

const NIL_UUID = '00000000-0000-0000-0000-000000000000'

export const isEncodeDeviceIdSupported = () => {
  try {
    encodeDeviceId({
      deviceIdVersion: 0,
      deviceId: NIL_UUID,
    })

    return true
  } catch {
    return false
  }
}
