import { useQuery } from 'react-query'

import { getSubmissionLatest } from '../../api'
import { QueryKey } from '../../utils'

export const useSubmissionLatest = () => {
  const { data, refetch, isLoading } = useQuery({
    queryKey: QueryKey.SubmissionLatest,
    queryFn: getSubmissionLatest,
    refetchOnWindowFocus: false,
  })

  return {
    refetch,
    submissionLatest: data,
    isLoading,
  }
}
