import { useMutation } from 'react-query'

import { AddressResponseItemDto } from '@revolut/rwa-core-types'
import { postCodeSearch } from '@revolut/rwa-core-api'

export const usePostCodeSearch = () => {
  const { mutate, data } = useMutation(postCodeSearch)

  return [mutate, data] as [typeof mutate, AddressResponseItemDto[] | undefined]
}
