import { keyBy } from 'lodash'
import { CurrenciesType, CurrencyDto, CurrencyType, CurrenciesFlag } from '../../types'
import currencyFlagsJson from '../json/currencyFlags.json'
import cryptosJson from '../json/cryptos.json'
import fiatCurrenciesJson from '../json/fiatCurrencies.json'
import commoditiesJson from '../json/commodities.json'

const currencyFlags = currencyFlagsJson as CurrenciesFlag

class CurrenciesStorage {
  crypto: CurrenciesType = {}

  fiat: CurrenciesType = {}

  commodity: CurrenciesType = {}

  // fallback currencies data
  constructor() {
    this.setCurrencies(CurrencyType.Commodity, commoditiesJson)
    this.setCurrencies(CurrencyType.Crypto, cryptosJson)
    this.setCurrencies(CurrencyType.Fiat, fiatCurrenciesJson)
  }

  setCurrencies(currencyType: CurrencyType, values: CurrencyDto[]) {
    const processedCurrencies = values.map((rawCurrency) => {
      const currencyCountry = currencyFlags[rawCurrency.isoCode]
      return {
        currency: rawCurrency.name,
        symbol: rawCurrency.symbol,
        code: rawCurrency.isoCode,
        fraction: rawCurrency.exponent,
        country: currencyCountry,
      }
    })
    this[currencyType] = keyBy(processedCurrencies, (currency) => currency.code)
  }
}

export const currenciesStorageInstance = new CurrenciesStorage()

export const setCryptoCurrencies = (rawCryptoCurrencies: CurrencyDto[]) => {
  currenciesStorageInstance.setCurrencies(CurrencyType.Crypto, rawCryptoCurrencies)
}

export const setFiatCurrencies = (rawFiatCurrencies: CurrencyDto[]) => {
  currenciesStorageInstance.setCurrencies(CurrencyType.Fiat, rawFiatCurrencies)
}

export const setCommodities = (rawCommodities: CurrencyDto[]) => {
  currenciesStorageInstance.setCurrencies(CurrencyType.Commodity, rawCommodities)
}
