import { AxiosResponse } from 'axios'
import { useMutation } from 'react-query'

import { createEvidence } from '../../api'

export type UseCreateEvidenceOnSuccess = (
  data: AxiosResponse<{
    id: string
  }>,
) => void

export const useCreateEvidence = ({
  onSuccess,
  onError,
}: {
  onError?: VoidFunction
  onSuccess?: UseCreateEvidenceOnSuccess
}) => {
  const { mutate, isLoading } = useMutation(createEvidence, {
    onSuccess,
    onError,
  })

  return {
    createEvidence: mutate,
    isLoading,
  }
}
