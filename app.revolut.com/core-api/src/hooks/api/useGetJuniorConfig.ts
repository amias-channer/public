import { useQuery } from 'react-query'

import { QueryKey } from '@revolut/rwa-core-utils'

import { getJuniorConfig } from '../../api'

export const useGetJuniorConfig = () => {
  const { data, isFetching } = useQuery(QueryKey.JuniorConfig, getJuniorConfig, {
    staleTime: Infinity,
  })

  return { juniorConfig: data, isJuniorConfigFetching: isFetching }
}
