import { useMutation, useQueryClient } from 'react-query'

import { createDocuments } from '../../api'
import { QueryKey } from '../../utils'

export const useCreateDocuments = ({
  onSuccess,
  onError,
}: {
  onError?: VoidFunction
  onSuccess?: VoidFunction
}) => {
  const queryClient = useQueryClient()
  const { mutate, isLoading } = useMutation(createDocuments, {
    onSuccess: () => {
      onSuccess?.()
      queryClient.invalidateQueries(QueryKey.SubmissionLatest)
      queryClient.invalidateQueries(QueryKey.SubmissionConfigs)
    },
    onError,
  })

  return {
    createDocuments: mutate,
    isLoading,
  }
}
