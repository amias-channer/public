import { useQuery } from 'react-query'

import { isRestrictedAccessToken, QueryKey } from '@revolut/rwa-core-utils'

import { getPendingCheckouts } from '../../../api'

export const useGetPendingCheckouts = (isEnabled: boolean) => {
  const { data, isFetching } = useQuery(QueryKey.PendingCheckouts, getPendingCheckouts, {
    enabled: !isRestrictedAccessToken() && isEnabled,
    refetchOnWindowFocus: false,
  })

  return {
    pendingCheckouts: data,
    isPendingCheckoutsFetching: isFetching,
  }
}
