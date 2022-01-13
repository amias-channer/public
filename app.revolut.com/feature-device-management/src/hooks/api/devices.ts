import { useQuery } from 'react-query'

import { UUID } from '@revolut/rwa-core-types'

import { getDevices } from '../../api'
import { QueryKey } from './consts'

export const useGetDevices = (deviceId: UUID, userId?: UUID) =>
  useQuery([QueryKey.Devices, userId, deviceId], () => getDevices(userId!, deviceId), {
    enabled: Boolean(userId),
  })
