import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import * as Sentry from '@sentry/react'

import { CurrencyType } from '@revolut/rwa-core-types'
import { QueryKey, SentryTag, buildSentryContext } from '@revolut/rwa-core-utils'
import {
  setCryptoCurrencies,
  setFiatCurrencies,
  setCommodities,
} from '@revolut/rwa-core-config'

import { fetchAvailableCurrencies } from '../../../api'

export const useUpdateCurrenciesList = (enabled?: boolean) => {
  const [isAttemptToUpdateComplete, setIsAttemptToUpdateComplete] = useState(false)

  const { isFetched: isFiatFetched } = useQuery(
    [QueryKey.Currencies, CurrencyType.Fiat],
    () => fetchAvailableCurrencies(CurrencyType.Fiat),
    {
      enabled,
      staleTime: Infinity,
      onError: (e) => {
        Sentry.captureException(e, {
          tags: {
            [SentryTag.Context]: buildSentryContext(['currencies update', 'fiat']),
          },
        })
      },
      onSuccess: (data) => {
        setFiatCurrencies(data)
      },
    },
  )
  const { isFetched: isCryptoFetched } = useQuery(
    [QueryKey.Currencies, CurrencyType.Crypto],
    () => fetchAvailableCurrencies(CurrencyType.Crypto),
    {
      enabled,
      staleTime: Infinity,
      onError: (e) => {
        Sentry.captureException(e, {
          tags: {
            [SentryTag.Context]: buildSentryContext(['currencies update', 'crypto']),
          },
        })
      },
      onSuccess: (data) => {
        setCryptoCurrencies(data)
      },
    },
  )
  const { isFetched: isCommoditiesFetched } = useQuery(
    [QueryKey.Currencies, CurrencyType.Commodity],
    () => fetchAvailableCurrencies(CurrencyType.Commodity),
    {
      enabled,
      staleTime: Infinity,
      onError: (e) => {
        Sentry.captureException(e, {
          tags: {
            [SentryTag.Context]: buildSentryContext(['currencies update', 'commodities']),
          },
        })
      },
      onSuccess: (data) => {
        setCommodities(data)
      },
    },
  )

  useEffect(() => {
    if (!isAttemptToUpdateComplete) {
      setIsAttemptToUpdateComplete(
        isCommoditiesFetched && isCryptoFetched && isFiatFetched,
      )
    }
  }, [isAttemptToUpdateComplete, isCommoditiesFetched, isCryptoFetched, isFiatFetched])

  return { isAttemptToUpdateComplete }
}
