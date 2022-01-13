import { useMutation, useQueryClient } from 'react-query'

import { deleteEvidence } from '../../api'
import { QueryKey } from '../../utils'

export const useDeleteEvidence = ({
  onSuccess,
  onError,
}: {
  onError?: VoidFunction
  onSuccess?: VoidFunction
}) => {
  const queryClient = useQueryClient()
  const { mutate, isLoading } = useMutation(deleteEvidence, {
    onSuccess: () => {
      onSuccess?.()
      queryClient.invalidateQueries(QueryKey.SubmissionLatest)
      queryClient.invalidateQueries(QueryKey.SubmissionConfigs)
    },
    onError,
  })

  return {
    deleteEvidence: mutate,
    isLoading,
  }
}
