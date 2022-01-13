import { useQuery } from 'react-query'

import { getAccounts } from '@revolut/rwa-core-api'
import { RevolutBankAccount } from '@revolut/rwa-core-types'
import { QueryKey, isRestrictedAccessToken } from '@revolut/rwa-core-utils'

export const useQueryAccounts = () => {
  const { data, status } = useQuery(QueryKey.Accounts, getAccounts, {
    staleTime: Infinity,
    enabled: !isRestrictedAccessToken(),
  })
  const accounts: RevolutBankAccount[] | undefined = data?.data

  return {
    data: accounts || [],
    status,
  }
}
