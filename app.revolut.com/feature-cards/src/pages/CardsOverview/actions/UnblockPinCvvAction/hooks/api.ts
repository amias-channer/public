import { useMutation } from 'react-query'

import { unblockCard } from '../../../../../api'

export const useUnblockPinCvv = () => {
  const { mutate, isLoading } = useMutation(unblockCard)

  return { unblockCardPinCvv: mutate, isLoading }
}
