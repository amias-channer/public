import { useMutation, useQueryClient } from 'react-query'

import { confirmSubmissionUpload } from '../../api'
import { QueryKey } from '../../utils'

export const useConfirm = ({
  onSuccess,
  onError,
}: {
  onError?: VoidFunction
  onSuccess?: VoidFunction
}) => {
  const queryClient = useQueryClient()
  const { mutate, isLoading } = useMutation(confirmSubmissionUpload, {
    onSuccess: () => {
      onSuccess?.()
      queryClient.invalidateQueries(QueryKey.SubmissionLatest)
    },
    onError,
  })

  return {
    confirmUpload: mutate,
    isLoading,
  }
}
