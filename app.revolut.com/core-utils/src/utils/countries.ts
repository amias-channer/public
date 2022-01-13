import {
  getCountryCallingCode,
  CountryCode as CountryCodeType,
} from 'libphonenumber-js/min'
import values from 'lodash/values'

import { ConfigKey, getConfigValue } from '@revolut/rwa-core-config'
import { CurrenciesType, CurrencyProperties } from '@revolut/rwa-core-types'

import { COUNTRIES, CountryCode } from './constants'

export const getCountryCodeByCountryCallingCode = (callingCode: string) =>
  values(COUNTRIES).find((country) => country.countryCallingCodes[0] === callingCode)

export const getPhoneCodeByCountryCode = (countryCode: string) => {
  if (!countryCode) {
    return ''
  }

  try {
    return `+${getCountryCallingCode(countryCode as CountryCodeType)}`
  } catch {
    return COUNTRIES[countryCode]?.countryCallingCodes[0]
  }
}

export const getCountryCodeByCurrencyCode = (currencyCode: string) => {
  const currencies = getConfigValue<CurrenciesType>(ConfigKey.Currencies)
  const currency: CurrencyProperties | undefined = currencies[currencyCode]

  if (!currency) {
    throw new Error(`Unsupported currency code: ${currencyCode}`)
  }

  return currency.country
}

export const isCountryWithoutRegion = (countryCode: string) => {
  const countriesWithoutRegion = getConfigValue<string>(ConfigKey.CountriesWithoutRegion)

  return countriesWithoutRegion.includes(countryCode)
}

export const isCountryCA = (countryCode: string) => countryCode === CountryCode.CA
