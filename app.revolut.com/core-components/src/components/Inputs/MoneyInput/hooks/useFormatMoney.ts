import { useCallback } from 'react'

import { Amount } from '@revolut/rwa-core-types'

import { joinNumberParts } from '../utils'
import { useFormatMoneyToParts } from './useFormatMoneyToParts'

type FormatMoneyOptions = Intl.NumberFormatOptions & { withCurrencySymbol?: boolean }

export function useFormatMoney(autoMinimumFractionDigits = true) {
  const formatMoneyToParts = useFormatMoneyToParts(autoMinimumFractionDigits)

  return useCallback(
    (input: Amount, options: FormatMoneyOptions = {}) => {
      const { withCurrencySymbol = true, ...formatNumberOptions } = options
      const parts = formatMoneyToParts(input, formatNumberOptions)

      if (!parts) {
        return undefined
      }

      if (!withCurrencySymbol) {
        const filtered = parts.filter(({ type }) => type !== 'currency')

        return joinNumberParts(filtered)
      }

      return joinNumberParts(parts)
    },
    [formatMoneyToParts],
  )
}
