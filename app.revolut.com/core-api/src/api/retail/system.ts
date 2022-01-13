import axios from 'axios'

import { UserConfigResponseDto } from '@revolut/rwa-core-types'

export const getUserConfig = async () => {
  const { data } = await axios.get<UserConfigResponseDto>('/retail/config/user')

  return data
}
