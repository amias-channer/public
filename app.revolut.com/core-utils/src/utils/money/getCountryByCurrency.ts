import { ConfigKey, getConfigValue } from '@revolut/rwa-core-config'
import { CurrenciesType } from '@revolut/rwa-core-types'

export const getCountryByCurrency = (currency: string | null) => {
  const CURRENCIES = getConfigValue<CurrenciesType>(ConfigKey.Currencies)
  return currency && CURRENCIES[currency] ? CURRENCIES[currency].country : null
}
