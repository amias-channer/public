import axios from 'axios'

import { WaitingListCurrentDto } from '@revolut/rwa-core-types'

export const getCurrentPosition = async () => {
  const { data } = await axios.get<WaitingListCurrentDto>('retail/waiting-list/current')
  return data
}
