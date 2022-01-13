import { useMutation } from 'react-query'

import { updateCardSettings } from '../../../../../api'

export const useUpdateCardSettings = () => {
  const { mutate, isLoading } = useMutation(updateCardSettings)

  return { updateCardSettings: mutate, isLoading }
}
