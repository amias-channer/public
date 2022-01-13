import { generatePath } from 'react-router-dom'

import { Url } from '@revolut/rwa-core-utils'

import { CryptoExchangeMethod } from '../types'

export const getCryptoExchangeMethodUrl = (
  cryptoCode: string,
  exchangeMethod: CryptoExchangeMethod,
) =>
  generatePath(Url.CryptoExchange, {
    cryptoCode,
    exchangeMethod,
  })

export const getCryptoExchangeConfirmationUrl = (
  cryptoCode: string,
  exchangeMethod: CryptoExchangeMethod,
) =>
  generatePath(Url.CryptoExchangeConfirmation, {
    cryptoCode,
    exchangeMethod,
  })
