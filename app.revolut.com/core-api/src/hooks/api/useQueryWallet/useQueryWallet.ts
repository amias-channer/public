import { useQuery } from 'react-query'

import { Wallet } from '@revolut/rwa-core-types'
import { QueryKey } from '@revolut/rwa-core-utils'

import { getWallet as callGetWalletApi } from '../../../api'

type Options = {
  enabled: boolean
}

export const useQueryWallet = (options: Options = { enabled: true }) => {
  const { data, status, refetch } = useQuery(QueryKey.Wallet, callGetWalletApi, {
    staleTime: Infinity,
    enabled: options.enabled,
  })

  const wallet = data?.data as Wallet | undefined

  return {
    data: wallet,
    status,
    refetch,
  }
}
