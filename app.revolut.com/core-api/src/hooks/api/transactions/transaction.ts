import { useQuery } from 'react-query'
import { QueryKey } from '@revolut/rwa-core-utils'

import { getTransactionById } from '../../../api'

export const useQueryTransactionById = (id: string) => {
  return useQuery([QueryKey.Transaction, id], () => getTransactionById(id))
}
