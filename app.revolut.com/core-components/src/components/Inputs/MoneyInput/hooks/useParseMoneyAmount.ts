import isNumber from 'lodash/isNumber'
import { useCallback } from 'react'

import { Currency } from '@revolut/rwa-core-types'
import { convertCurrencyToMonetaryUnits } from '@revolut/rwa-core-utils'

import { MoneyInputValue } from '../types'
import { useParseNumber } from './useParseNumber'

export function useParseMoneyAmount() {
  const parseNumber = useParseNumber()

  return useCallback(
    (input: MoneyInputValue, currency: Currency) => {
      if (isNumber(input)) {
        return input
      }

      return convertCurrencyToMonetaryUnits(currency, parseNumber(input))
    },
    [parseNumber],
  )
}
