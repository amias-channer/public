import axios from 'axios'
import qs from 'qs'

import {
  Quote,
  AssetsQuoteType,
  AssetsQuoteDirection,
  OrderType,
  AssetsQuoteResponseDto,
  VolatilityQuoteDto,
  QuoteRateSide,
} from '@revolut/rwa-core-types'
import { HttpHeader } from '@revolut/rwa-core-utils'

export const getQuote = (symbol: string[], rateSide?: QuoteRateSide) =>
  axios.get<Quote[]>('retail/quote', {
    params: { symbol, rateSide },
    paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
  })

export type AssetsQuoteArgs = {
  fromAssetType: AssetsQuoteType
  fromSymbol: string
  toAssetType: AssetsQuoteType
  toSymbol: string
  orderType: OrderType
  baseRateAsset: AssetsQuoteDirection
  amountIn: AssetsQuoteDirection
  amount: string
  targetRate?: string
}

export const getAssetsQuote = async (params: AssetsQuoteArgs, locale?: string) => {
  const headers = locale
    ? {
        [HttpHeader.AcceptLanguage]: locale,
      }
    : undefined

  const { data } = await axios.get<AssetsQuoteResponseDto>('retail/assets/quote', {
    headers,
    params,
  })

  return data
}

export const getVolatilityQuotes = async (symbols: string[]) => {
  const { data } = await axios.get<VolatilityQuoteDto[]>('retail/quote/volatility', {
    params: { symbols },
    paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
  })
  return data
}
