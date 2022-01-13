import { useQuery } from 'react-query'

import { QueryKey } from '@revolut/rwa-core-utils'

import { getCardDesigns } from '../../../../api'

export const useGetPhysicalCardDesigns = () => {
  const { data } = useQuery(QueryKey.PhysicalCardDesigns, getCardDesigns, {
    staleTime: Infinity,
  })

  return { physicalCardDesigns: data }
}
