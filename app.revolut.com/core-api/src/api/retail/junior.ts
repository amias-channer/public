import axios from 'axios'

import { JuniorConfigDto } from '@revolut/rwa-core-types'

export const getJuniorConfig = async () => {
  const { data } = await axios.get<JuniorConfigDto>('/retail/youth/config')

  return data
}
