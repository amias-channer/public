import axios from 'axios'
import { QueryClient } from 'react-query'

import { CommonConfigResponseDto } from '@revolut/rwa-core-types'
import { QueryKey } from '@revolut/rwa-core-utils'

export const getCommonConfig = async () => {
  const { data } = await axios.get<CommonConfigResponseDto>('/retail/config/common')

  return data
}

export const prefetchCommonConfig = (queryClient: QueryClient) =>
  queryClient.prefetchQuery(QueryKey.CommonConfig, getCommonConfig, {
    staleTime: Infinity,
    cacheTime: Infinity,
  })
