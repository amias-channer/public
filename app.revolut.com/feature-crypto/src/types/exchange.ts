export enum CryptoExchangeMethod {
  Buy = 'buy',
  Sell = 'sell',
}

export type CryptoExchangeParams = {
  amount: number
  cryptoCurrencySymbol: string
  exchangeMethod: CryptoExchangeMethod
  fiatCurrencySymbol: string
  isCryptoInputFocused: boolean
}

export type CryptoExchangeUrlParams = {
  cryptoCode: string
  exchangeMethod: CryptoExchangeMethod
}

export type CurrentExchangeRate = {
  rate: number
  timestamp: number
}
