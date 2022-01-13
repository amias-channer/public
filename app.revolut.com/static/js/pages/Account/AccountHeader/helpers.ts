import { TFunction } from 'i18next'

import { ConfigKey, getConfigValue } from '@revolut/rwa-core-config'
import { CurrenciesType, Pocket } from '@revolut/rwa-core-types'

export const getPocketName = (t: TFunction, pocket?: Pocket) => {
  const currencies = getConfigValue<CurrenciesType>(ConfigKey.Currencies)
  if (!pocket) {
    return null
  }

  const pocketCurrencyName =
    Boolean(pocket) && currencies[pocket.currency]
      ? t(`currency-${pocket.currency}-name`)
      : null

  const pocketCurrencyCode = pocket.currency
  if (pocketCurrencyName) {
    return `${pocketCurrencyName} · ${pocketCurrencyCode}`
  }

  return pocketCurrencyCode
}

export const getPocketNameByCurrency = (t: TFunction, currency?: string) => {
  if (!currency) {
    return null
  }
  const currencies = getConfigValue<CurrenciesType>(ConfigKey.Currencies)

  const pocketCurrencyName = currencies[currency] ? t(`currency-${currency}-name`) : null

  if (pocketCurrencyName) {
    return `${pocketCurrencyName}`
  }

  return currency
}

export const getCountry = (pocket?: Pocket) => {
  const currencies = getConfigValue<CurrenciesType>(ConfigKey.Currencies)
  return pocket ? currencies[pocket.currency].country : null
}
