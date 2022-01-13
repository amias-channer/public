import { useQuery } from 'react-query'

import { getAccounts, getUserCompany, getWallet } from '@revolut/rwa-core-api'
import { QueryKey } from '@revolut/rwa-core-utils'

export const useQueryAccounts = () => {
  const { data, status } = useQuery(QueryKey.Accounts, getAccounts, {
    staleTime: Infinity,
  })
  const accounts = data?.data ?? []

  return {
    data: accounts,
    status,
  }
}

export const useQueryUserCompany = () => {
  const { data, status } = useQuery(QueryKey.UserCompany, getUserCompany, {
    staleTime: Infinity,
  })
  const userCompany = data?.data

  return {
    data: userCompany,
    status,
  }
}

export const useQueryWallet = () => {
  const query = useQuery(QueryKey.Wallet, getWallet, {
    staleTime: Infinity,
  })

  const wallet = query.data?.data

  return {
    data: wallet,
    status: query.status,
  }
}
