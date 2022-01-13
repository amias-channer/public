import { useMutation } from 'react-query'

import { addressSuggestions, getAddress } from '@revolut/rwa-core-api'

export const useAddressSuggestions = () => {
  const { mutate, status } = useMutation(addressSuggestions)

  return [mutate, status === 'loading'] as [typeof mutate, boolean]
}

export const useGetAddressForSuggestion = () => {
  const { mutate, status } = useMutation(getAddress)

  return [mutate, status === 'loading'] as [typeof mutate, boolean]
}
