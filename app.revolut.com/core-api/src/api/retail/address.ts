import axios from 'axios'

import {
  AddressResponseItemDto,
  AddressResultResponseDto,
  AddressSuggestionResponseItemDto,
} from '@revolut/rwa-core-types'

type AddressSearchArgs = {
  countryCode: string
  searchValue: string
  parent?: string
}

export const postCodeSearch = async ({ countryCode, searchValue }: AddressSearchArgs) => {
  const { data } = await axios.get<AddressResponseItemDto[]>(
    `/retail/address/${countryCode}/${searchValue}`,
  )

  return data
}

export const addressSuggestions = async ({
  countryCode,
  searchValue,
  parent,
}: AddressSearchArgs) => {
  const { data } = await axios.get<AddressSuggestionResponseItemDto[]>(
    '/retail/address-suggestions',
    {
      params: {
        text: searchValue,
        country: countryCode,
        parent,
      },
    },
  )

  return data
}

export const getAddress = async (addressId: string) => {
  const { data } = await axios.get<AddressResultResponseDto>(
    `/retail/address-suggestions/${encodeURI(addressId)}`,
  )

  return data
}
