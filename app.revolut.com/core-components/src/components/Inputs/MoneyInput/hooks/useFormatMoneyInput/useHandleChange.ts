import { Dispatch, SetStateAction, useCallback } from 'react'

import { Currency } from '@revolut/rwa-core-types'
import { getDecimalSeparator } from '@revolut/rwa-core-utils'

import { MoneyInputValue } from '../../types'
import { useCurrencySign } from '../useCurrencySign'
import { useParseMoneyAmount } from '../useParseMoneyAmount'

const ZERO = '0'

export const useHandleChange = (
  currency: Currency,
  value: MoneyInputValue,
  onChange: (value: MoneyInputValue) => void,
  setTempValue: Dispatch<SetStateAction<[string, MoneyInputValue] | undefined>>,
) => {
  const currencySign = useCurrencySign(currency)
  const parseMoneyAmount = useParseMoneyAmount()
  const separator = getDecimalSeparator()

  return useCallback(
    (nextValue) => {
      const lastChar = nextValue.endsWith(currencySign)
        ? nextValue.substr(-currencySign.length - 1, 1)
        : nextValue.slice(-1)

      const restored = parseMoneyAmount(nextValue, currency)

      if (
        lastChar === separator ||
        (nextValue.includes(separator) && lastChar === ZERO)
      ) {
        setTempValue([nextValue, restored])

        if (restored !== value) {
          onChange(restored)
        }
      } else {
        setTempValue(undefined)
        onChange(restored)
      }
    },
    [onChange, separator, currencySign, parseMoneyAmount, currency, value, setTempValue],
  )
}
