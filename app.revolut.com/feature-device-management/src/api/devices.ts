import axios from 'axios'

import { UUID } from '@revolut/rwa-core-types'
import { HttpHeader } from '@revolut/rwa-core-utils'

import { DeviceResponse } from 'types'

import { DeviceManagementApiUrlPrefix } from './consts'

export const getDevices = async (
  userId: UUID,
  deviceId: UUID,
): Promise<DeviceResponse[]> => {
  const headers = {
    [HttpHeader.UserId]: userId,
    [HttpHeader.DeviceId]: deviceId,
  }
  const { data } = await axios.get<DeviceResponse[]>(DeviceManagementApiUrlPrefix, {
    headers,
  })
  return data
}
