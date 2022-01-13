import axios from 'axios'

import { GetRecurringPaymentsResponseDto } from '@revolut/rwa-core-types'

export const getRecurringPayments = async () => {
  const { data } = await axios.get<GetRecurringPaymentsResponseDto>(
    `/retail/recurring-payments`,
  )

  return data
}
