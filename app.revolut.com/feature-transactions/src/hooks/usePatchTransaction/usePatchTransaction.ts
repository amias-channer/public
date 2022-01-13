import { useMutation } from 'react-query'

import { patchTransaction } from '../../api'

export const usePatchTransaction = () => {
  const { mutate, isLoading } = useMutation(patchTransaction)

  return {
    patchTransaction: mutate,
    isPatching: isLoading,
  }
}
