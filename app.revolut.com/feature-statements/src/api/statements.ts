import axios from 'axios'

import { StatementResponseDto } from '@revolut/rwa-core-types'

type StatementResponse = StatementResponseDto

export const fetchStatement = async (url: string, params: Object) => {
  const { data } = await axios.get<StatementResponse>(`/retail/${url}`, {
    params,
  })

  return data
}
