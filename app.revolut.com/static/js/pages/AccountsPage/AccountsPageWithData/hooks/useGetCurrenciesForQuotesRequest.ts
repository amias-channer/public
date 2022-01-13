import { useMemo } from 'react'

import { Wallet } from '@revolut/rwa-core-types'

import { getCurrenciesForQuotesRequest } from '../helpers'

export const useGetCurrenciesForQuotesRequest = (
  selectedCurrency: string | null,
  wallet?: Wallet,
) => {
  return useMemo(() => {
    return wallet && selectedCurrency
      ? getCurrenciesForQuotesRequest(wallet, selectedCurrency)
      : null
  }, [selectedCurrency, wallet])
}
