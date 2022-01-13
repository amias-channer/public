import { ConfigKey, getConfigValue } from '@revolut/rwa-core-config'
import { CurrenciesType } from '@revolut/rwa-core-types'

export const getAllCurrenciesConfig = () => {
  return {
    ...getConfigValue<CurrenciesType>(ConfigKey.Currencies),
    ...getConfigValue<CurrenciesType>(ConfigKey.CryptoCurrencies),
    ...getConfigValue<CurrenciesType>(ConfigKey.Commodities),
  }
}
