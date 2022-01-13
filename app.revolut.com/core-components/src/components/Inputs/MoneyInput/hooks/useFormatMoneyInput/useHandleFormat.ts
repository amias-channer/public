import isNil from 'lodash/isNil'
import isString from 'lodash/isString'
import { useCallback } from 'react'

import { ConfigKey, getConfigValue } from '@revolut/rwa-core-config'
import { Currency, CurrenciesType } from '@revolut/rwa-core-types'
import { getDecimalSeparator } from '@revolut/rwa-core-utils'

import { useCurrencySign } from '../useCurrencySign'
import { useFormatMoney } from '../useFormatMoney'
import { useParseMoneyAmount } from '../useParseMoneyAmount'

const ZERO = '0'

export const useHandleFormat = (
  currency: Currency,
  prefix: string,
  withCurrencySymbol: boolean,
) => {
  const currencies = getConfigValue<CurrenciesType>(ConfigKey.Currencies)
  const formatMoney = useFormatMoney()
  const meta = currencies[currency]
  const separator = getDecimalSeparator()
  const currencySign = useCurrencySign(currency)
  const parseMoneyAmount = useParseMoneyAmount()

  return useCallback(
    (input) => {
      const amount = parseMoneyAmount(input, currency)

      if (!meta || isNil(amount)) {
        return ''
      }

      const formatted = formatMoney(
        { amount, currency },
        {
          withCurrencySymbol,
          minimumFractionDigits: 0,
          maximumFractionDigits: meta.fraction,
        },
      )

      if (isNil(formatted)) {
        return ''
      }

      const prefixed = `${prefix}${formatted}`
      const [, tail] = String(input).split(separator)

      if (!isString(tail) || prefixed.includes(separator)) {
        return prefixed
      }

      if (!currencySign || !prefixed.endsWith(currencySign)) {
        const zeros = ZERO.repeat(Math.min(tail.length, meta.fraction))

        return `${prefixed}${separator}${zeros}`
      }

      const zeros = ZERO.repeat(
        Math.min(tail.replace(currencySign, '').length, meta.fraction),
      )

      return `${prefixed.replace(currencySign, '')}${separator}${zeros}${currencySign}`
    },
    [
      currency,
      currencySign,
      formatMoney,
      meta,
      parseMoneyAmount,
      prefix,
      separator,
      withCurrencySymbol,
    ],
  )
}
