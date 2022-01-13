import { useQuery } from 'react-query'

import { useAuthContext } from '@revolut/rwa-core-auth'
import { QueryKey } from '@revolut/rwa-core-utils'

import { getTransactions } from '../api'

export const useGetFirstUserTransaction = (pocketId?: string) => {
  const { user } = useAuthContext()

  const { data: response } = useQuery(
    [QueryKey.FirstTransaction, user?.createdDate, pocketId],
    () => getTransactions({ count: 1, from: user?.createdDate, pocketId }),
    {
      enabled: Boolean(user),
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    },
  )

  return response?.data[0]
}
