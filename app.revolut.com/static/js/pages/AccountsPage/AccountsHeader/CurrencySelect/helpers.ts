import { ConfigKey, getConfigValue } from '@revolut/rwa-core-config'
import { CurrenciesType, Currency } from '@revolut/rwa-core-types'

type Option = {
  label: string
  value: string
  currency: Currency
}

export const prepareCurrencyOptions = (currenciesList: any[]): Option[] => {
  const currencies = getConfigValue<CurrenciesType>(ConfigKey.Currencies)

  return currenciesList.reduce((acc, currencyCode) => {
    if (currencies[currencyCode]) {
      acc.push({
        label: currencies[currencyCode].code,
        value: currencies[currencyCode].code,
        currency: currencies[currencyCode].currency,
      })
    }

    return acc
  }, [])
}
