import { getConfigValue, ConfigKey } from '@revolut/rwa-core-config'

export const checkIfCryptoCurrency = (code: string) => {
  const cryptoCurrencies = getConfigValue(ConfigKey.CryptoCurrencies)
  return Object.keys(cryptoCurrencies).includes(code)
}

export const checkIfCommodityCurrency = (code: string) => {
  const commodities = getConfigValue(ConfigKey.Commodities)
  return Object.keys(commodities).includes(code)
}

export const checkIfFiatCurrency = (code: string) =>
  !checkIfCryptoCurrency(code) && !checkIfCommodityCurrency(code)
