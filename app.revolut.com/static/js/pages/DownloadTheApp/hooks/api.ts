import { useMutation } from 'react-query'

import { linkPhoneToPromotion } from 'api'

export const useLinkPhoneToPromotion = () => {
  const { mutate, status } = useMutation(linkPhoneToPromotion)

  return { linkPhoneToPromotion: mutate, isLoading: status === 'loading' }
}
