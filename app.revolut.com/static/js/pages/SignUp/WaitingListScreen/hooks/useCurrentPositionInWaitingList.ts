import { useQuery } from 'react-query'

import { QueryKey } from '@revolut/rwa-core-utils'

import { getCurrentPosition } from 'api'

export const useCurrentPositionInWaitingList = () => {
  const { data, isLoading } = useQuery(
    QueryKey.WaitingListCurrentPosition,
    getCurrentPosition,
  )
  return { currentPositionData: data, isLoading }
}
