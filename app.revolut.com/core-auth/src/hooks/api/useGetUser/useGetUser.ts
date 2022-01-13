import { useQuery } from 'react-query'

import { UserDto } from '@revolut/rwa-core-types'
import { QueryKey } from '@revolut/rwa-core-utils'

import { getUser } from '../../../api'

export type UseGetUserReturn = [UserDto | undefined, boolean, () => Promise<unknown>]

/**
 * Should not be used outside the "core-auth" module.
 */
export const useGetUser = () => {
  const {
    data: axiosData,
    isFetching,
    refetch,
  } = useQuery(QueryKey.User, getUser, {
    staleTime: Infinity,
    retry: false,
    refetchOnWindowFocus: false,
  })

  return [axiosData?.data?.user, isFetching, refetch] as UseGetUserReturn
}
