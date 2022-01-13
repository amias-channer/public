import { useMutation } from 'react-query'

import { submitEvidenceQuestions } from '../../api'

export const useSubmitEvidenceQuestions = ({
  onSuccess,
  onError,
}: {
  onError?: VoidFunction
  onSuccess?: VoidFunction
}) => {
  const { mutate, isLoading } = useMutation(submitEvidenceQuestions, {
    onSuccess,
    onError,
  })

  return {
    submitQuestions: mutate,
    isLoading,
  }
}
