import { useMutation } from 'react-query'

import { submitSubmissionQuestions } from '../../api'

export const useSubmitSubmissionQuestions = ({
  onSuccess,
  onError,
}: {
  onError?: VoidFunction
  onSuccess?: VoidFunction
}) => {
  const { mutate, isLoading } = useMutation(submitSubmissionQuestions, {
    onSuccess,
    onError,
  })

  return {
    submitQuestions: mutate,
    isLoading,
  }
}
