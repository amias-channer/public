import { useQuery } from 'react-query'

import { QueryKey } from '@revolut/rwa-core-utils'

import { getSmartDelayConfig } from '../../api'

export const useGetSmartDelayConfig = () => {
  const { data, isFetching } = useQuery(QueryKey.SmartDelayConfig, getSmartDelayConfig, {
    staleTime: Infinity,
  })

  return {
    smartDelayConfig: data,
    isSmartDelayFetching: isFetching,
  }
}
