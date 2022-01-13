import { AxiosError } from 'axios'
import { useQuery } from 'react-query'

import { HttpCode, QueryKey } from '@revolut/rwa-core-utils'

import { getUser } from '../../api'

const QUERY_KEY = 'StatusCode'
const REFETCH_INTERVAL = 3_000

export const useGetUserRequestStatusCode = (enabled: boolean) => {
  const { error } = useQuery([QueryKey.User, QUERY_KEY], getUser, {
    enabled,
    staleTime: 0,
    cacheTime: 0,
    retry: false,
    refetchInterval: REFETCH_INTERVAL,
  })

  const statusCode = (error as AxiosError)?.response?.status as HttpCode | undefined

  return { statusCode }
}
