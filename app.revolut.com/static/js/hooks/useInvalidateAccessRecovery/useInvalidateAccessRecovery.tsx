import { useMutation } from 'react-query'

import { invalidateAccessRecovery } from 'api'

export const useInvalidateAccessRecovery = () => {
  const { mutate } = useMutation(invalidateAccessRecovery)

  return {
    invalidateAccessRecovery: mutate,
  }
}
