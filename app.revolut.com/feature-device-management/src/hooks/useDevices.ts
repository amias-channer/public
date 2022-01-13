import { DefaultStorageKey, useDefaultStorage } from '@revolut/rwa-core-utils'
import { useAuthContext } from '@revolut/rwa-core-auth'

import { useGetDevices } from './api'

export const useDevices = () => {
  const { user } = useAuthContext()
  const [currentDeviceId] = useDefaultStorage(DefaultStorageKey.DeviceId, '')

  const { data } = useGetDevices(currentDeviceId, user?.id)

  return data ?? []
}
