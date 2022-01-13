import { useMutation, useQueryClient } from 'react-query'

import { QueryKey } from '@revolut/rwa-core-utils'

import { createBankAddress } from '../../../api'

export const useCreateBankAddress = () => {
  const queryClient = useQueryClient()
  const { mutate, isLoading } = useMutation(createBankAddress, {
    onSuccess: () => queryClient.invalidateQueries(QueryKey.Accounts),
  })

  return { createBankAddress: mutate, isLoading }
}
