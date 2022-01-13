import { useQuery } from 'react-query'

import { getSubmissionSowState } from '../../api'
import { QueryKey } from '../../utils'

export const useSowState = () => {
  const { data, isLoading } = useQuery({
    queryKey: QueryKey.SubmissionState,
    queryFn: getSubmissionSowState,
    refetchOnWindowFocus: false,
  })

  return {
    sowState: data?.sourceOfWealth,
    isLoading,
  }
}
