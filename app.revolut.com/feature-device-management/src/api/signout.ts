import axios from 'axios'

import { UUID } from '@revolut/rwa-core-types'
import { HttpHeader } from '@revolut/rwa-core-utils'

import { DeviceManagementApiUrlPrefix } from './consts'

export const signout = async ({
  userId,
  deviceId,
}: {
  userId: UUID
  deviceId: UUID
}): Promise<void> => {
  const headers = {
    [HttpHeader.UserId]: userId,
  }
  await axios.post<void>(`${DeviceManagementApiUrlPrefix}/${deviceId}/signout`, {
    headers,
  })
}
