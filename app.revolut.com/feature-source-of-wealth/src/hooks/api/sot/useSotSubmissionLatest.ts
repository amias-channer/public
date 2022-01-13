import { useQuery } from 'react-query'
import { getSotSubmissionLatest } from '../../../api/sot/submission'

import { SOTLatestSubmission } from '../../../types/generated/sot'

import { QueryKey } from '../../../utils'

export const useSotSubmissionLatest = () => {
  const { data, isLoading } = useQuery<SOTLatestSubmission>({
    queryKey: QueryKey.SotSubmissionLatest,
    queryFn: getSotSubmissionLatest,
    refetchOnWindowFocus: false,
  })

  return {
    submissionLatest: data,
    isLoading,
  }
}
