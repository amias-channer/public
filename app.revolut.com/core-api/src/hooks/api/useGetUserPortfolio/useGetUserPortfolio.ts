import { useQuery } from 'react-query'

import { UserPortfolioDto } from '@revolut/rwa-core-types'
import { QueryKey } from '@revolut/rwa-core-utils'

import { getUserPortfolio } from '../../../api'

type Options = {
  enabled?: boolean
  refetch?: boolean
}

const REFETCH_INTERVAL = 15000

export const useGetUserPortfolio = ({
  refetch = false,
  enabled = true,
}: Options = {}) => {
  const {
    data: axiosData,
    isFetching,
    isFetched,
  } = useQuery(QueryKey.UserPortfolio, getUserPortfolio, {
    refetchInterval: refetch && REFETCH_INTERVAL,
    refetchIntervalInBackground: refetch,
    enabled,
    keepPreviousData: true,
  })

  return [axiosData?.data, { isFetching, isFetched }] as [
    UserPortfolioDto | undefined,
    { isFetching: boolean; isFetched: boolean },
  ]
}
