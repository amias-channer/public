import { useMutation, useQueryClient } from 'react-query'

import { signout } from '../../api'
import { QueryKey } from './consts'

export const useSignout = () => {
  const queryClient = useQueryClient()
  return useMutation(signout, {
    onSuccess: () => {
      queryClient.invalidateQueries([QueryKey.Devices])
    },
  })
}
