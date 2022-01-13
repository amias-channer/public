import isNil from 'lodash/isNil'
import { useCallback } from 'react'

import { ConfigKey, getConfigValue } from '@revolut/rwa-core-config'
import { CurrenciesType, Amount } from '@revolut/rwa-core-types'
import {
  convertMonetaryToCurrencyUnits,
  getCurrentLocale,
  normalizeLocale,
} from '@revolut/rwa-core-utils'

import { replaceCurrencySymbolInParts } from '../utils'

export function useFormatMoneyToParts(autoMinimumFractionDigits = true) {
  return useCallback(
    ({ currency, amount }: Amount, formatNumberOptions?: Intl.NumberFormatOptions) => {
      const currencies = getConfigValue<CurrenciesType>(ConfigKey.Currencies)
      const currencyMeta = currencies[currency]

      if (!currencyMeta) {
        return undefined
      }

      const amountInCurrencyUnits = convertMonetaryToCurrencyUnits(currency, amount)

      if (isNil(amountInCurrencyUnits)) {
        return undefined
      }

      const isInteger = amountInCurrencyUnits % 1 === 0
      const shouldHideFraction = autoMinimumFractionDigits && isInteger

      const intl = new Intl.NumberFormat(normalizeLocale(getCurrentLocale()), {
        style: 'currency',
        currency,
        minimumFractionDigits: shouldHideFraction ? 0 : currencyMeta.fraction,
        ...formatNumberOptions,
      })

      const parts = intl.formatToParts(amountInCurrencyUnits)

      return replaceCurrencySymbolInParts(parts, currency)
    },
    [autoMinimumFractionDigits],
  )
}
