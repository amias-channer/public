import { useQuery } from 'react-query'

import { getEvidenceTypes } from '../../api'
import { QueryKey } from '../../utils'

export const useEvidenceTypes = () => {
  const { data, isLoading } = useQuery({
    queryKey: QueryKey.EvidenceTypes,
    queryFn: getEvidenceTypes,
    refetchOnWindowFocus: false,
  })

  return {
    evidenceTypes: data,
    isLoading,
  }
}
