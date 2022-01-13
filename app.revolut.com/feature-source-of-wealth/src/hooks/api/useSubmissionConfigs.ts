import { useQuery } from 'react-query'

import { getSubmissionConfigs } from '../../api'
import { QueryKey } from '../../utils'

export const useSubmissionConfigs = () => {
  const { data, refetch, isLoading } = useQuery({
    queryKey: QueryKey.SubmissionConfigs,
    queryFn: getSubmissionConfigs,
    refetchOnWindowFocus: false,
  })

  return {
    submissionConfigs: data,
    isLoading,
    refetch,
  }
}
