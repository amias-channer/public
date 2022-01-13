import { useMutation } from 'react-query'

import { confirmTransaction, declineTransaction } from '../../api'

export const useSuspiciousTransactionHandler = () => {
  const { mutate: decline } = useMutation(declineTransaction)
  const { mutate: confirm } = useMutation(confirmTransaction)

  return {
    decline,
    confirm,
  }
}
