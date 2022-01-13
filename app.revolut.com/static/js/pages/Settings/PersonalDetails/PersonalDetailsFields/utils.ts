import { AddressDto } from '@revolut/rwa-core-types'
import { COUNTRIES } from '@revolut/rwa-core-utils'

import { GetCountryTranslation } from '@revolut/rwa-core-i18n'

const getUserAddressFragment = (addressPart?: string) => {
  if (!addressPart) {
    return ''
  }

  return `${addressPart},\n`
}

export const getUserFullAddress = (
  address: AddressDto,
  getCountryTranslation: GetCountryTranslation,
) => {
  const countryName = COUNTRIES[address.country].name

  return `${getUserAddressFragment(address.streetLine1)}${getUserAddressFragment(
    address.streetLine2,
  )}${getUserAddressFragment(address.postcode)}${getUserAddressFragment(
    address.city,
  )}${getCountryTranslation({ countryCode: address.country, countryName })}`
}
