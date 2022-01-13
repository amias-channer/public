import * as Sentry from '@sentry/react'

import { Currency } from '@revolut/rwa-core-types'
import { useQueryVolatilityQuotes, useQueryQuotes } from '@revolut/rwa-core-api'

type CurrencyRateAndVolatility =
  | {
      from: Currency
      to: Currency
      rate: number
      volatility: number
    }
  | undefined

type useCryptoRateAndVolatilityHookResponse = {
  isLoading: boolean
  data: CurrencyRateAndVolatility[]
}

type UseCryptoRateAndVolatilityHook = (
  currencies: string[],
) => useCryptoRateAndVolatilityHookResponse

export const REFETCH_INTERVAL = 3_000

export const useCryptoRateAndVolatility: UseCryptoRateAndVolatilityHook = (
  currencies: string[],
) => {
  const { data: rates, status: ratesStatus } = useQueryQuotes(
    currencies,
    REFETCH_INTERVAL,
  )

  const { data: volatilities, status: volatilityStatus } = useQueryVolatilityQuotes(
    currencies,
    REFETCH_INTERVAL,
  )

  const isLoading = ratesStatus === 'loading' || volatilityStatus === 'loading'

  if (isLoading || !rates || !volatilities) {
    return {
      isLoading,
      data: [],
    }
  }

  const rateAndVolatility: CurrencyRateAndVolatility[] = volatilities.map(
    ({ from, to, volatility }) => {
      const foundRate = rates.find((rate) => rate.from === from && rate.to === to)

      if (!foundRate) {
        Sentry.captureException(`Rate for ${from} / ${to} is not found`)
        return undefined
      }

      return {
        from,
        to,
        rate: foundRate ? foundRate.rate : 0,
        volatility,
      }
    },
  )

  return {
    isLoading: false,
    data: rateAndVolatility,
  }
}
