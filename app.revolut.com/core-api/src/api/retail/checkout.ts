import axios from 'axios'

import { CheckoutResponseDto } from '@revolut/rwa-core-types'

export const getPendingCheckouts = async (): Promise<CheckoutResponseDto[]> => {
  const { data } = await axios.get<CheckoutResponseDto[]>('/retail/checkouts')

  return data
}
