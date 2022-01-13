import { useQuery } from 'react-query'

import { QueryKey } from '@revolut/rwa-core-utils'

import { getUserFeatures } from '../../api'

type Options = {
  enabled?: boolean
}

export const useGetUserFeatures = ({ enabled = true }: Options = {}) => {
  const { data: axiosData, isFetched } = useQuery(
    QueryKey.UserFeatures,
    getUserFeatures,
    {
      staleTime: Infinity,
      enabled,
    },
  )

  return { userFeatures: axiosData?.data, isUserFeaturesFetched: isFetched }
}
