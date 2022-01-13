import { useCallback } from 'react'
import { useQueryClient } from 'react-query'

import { QueryKey } from '@revolut/rwa-core-utils'

export const useRefreshAccountBalance = () => {
  const queryClient = useQueryClient()

  return useCallback(() => queryClient.invalidateQueries(QueryKey.Wallet), [queryClient])
}
