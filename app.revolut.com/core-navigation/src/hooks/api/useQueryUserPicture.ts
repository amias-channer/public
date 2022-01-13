import { AxiosError } from 'axios'
import isNil from 'lodash/isNil'
import { useQuery, useQueryClient } from 'react-query'

import { QueryKey, HttpCode } from '@revolut/rwa-core-utils'

import { addBase64Prefix } from '../../utils'
import { getUserPicture as callGetUserPictureEndpoint } from './user'

export const useQueryUserPicture = () => {
  const queryClient = useQueryClient()

  const { data, isFetching } = useQuery(
    QueryKey.UserPicture,
    callGetUserPictureEndpoint,
    {
      staleTime: Infinity,
      cacheTime: Infinity,

      onError: (e: AxiosError) => {
        // Prevents further attempts to load the picture
        if (e.response?.status === HttpCode.NotFound) {
          queryClient.setQueryData(QueryKey.UserPicture, undefined)
        }
      },
    },
  )

  return {
    data: isNil(data) ? data : addBase64Prefix(data),
    isFetching,
  }
}
