import { useCallback, useMemo } from 'react'
import { useQuery } from 'react-query'
import { isEmpty, isString } from 'lodash'
import Big from 'big.js'

import { checkRequired, QueryKey } from '@revolut/rwa-core-utils'
import { QuoteRateSide, Currency } from '@revolut/rwa-core-types'

import { getQuote } from '../../../api'

const QUOTES_REQUEST_REFETCH_INTERVAL = 1000 * 60
const DEFAULT_CURRENCY = 'USD'

export const useQueryQuotes = (
  currenciesForQuotesRequest?: string[] | null,
  refetchInterval = QUOTES_REQUEST_REFETCH_INTERVAL,
  rateSide?: QuoteRateSide,
) => {
  const { data, status } = useQuery(
    [QueryKey.Quotes, currenciesForQuotesRequest],
    () =>
      getQuote(
        checkRequired(currenciesForQuotesRequest, 'Currencies can not be empty'),
        rateSide,
      ),
    {
      enabled:
        Boolean(currenciesForQuotesRequest) &&
        Boolean(currenciesForQuotesRequest?.length),
      refetchInterval,
    },
  )

  const quotes = useMemo(
    () =>
      data?.data.map((quote) => ({
        ...quote,
        // For rateSide = Mid and Ask, backend returns rate as a string
        rate: isString(quote.rate) ? parseFloat(quote.rate) : quote.rate,
      })) ?? [],
    [data],
  )

  const getRate = useCallback(
    (from: Currency, to: Currency) => {
      if (isEmpty(quotes)) {
        return null
      }

      const foundRate = quotes.find((rate) => rate.from === from && rate.to === to)
      if (!foundRate) {
        throw new Error(`No rate info for ${from}/${to}`)
      }
      return foundRate
    },
    [quotes],
  )

  const convert = useCallback(
    (value: number, targetCurrency: Currency, currency: Currency = DEFAULT_CURRENCY) => {
      if (currency === targetCurrency || isEmpty(quotes)) {
        return value
      }

      const quote = getRate(currency, targetCurrency)

      return quote ? Big(value).mul(quote.rate).toNumber() : value
    },
    [getRate, quotes],
  )

  return { data: quotes, status, convert, getRate }
}
