import { useState, useLayoutEffect } from 'react'
import { useRifm } from 'rifm'

import { Currency } from '@revolut/rwa-core-types'
import { getDecimalSeparator } from '@revolut/rwa-core-utils'

import { MoneyInputValue } from '../../types'
import { useHandleChange } from './useHandleChange'
import { useHandleFormat } from './useHandleFormat'

type Props = {
  currency: Currency
  value: MoneyInputValue
  prefix?: string
  withCurrencySymbol?: boolean
  onChange: (value: MoneyInputValue) => void
}

export function useFormatMoneyInput({
  currency,
  value,
  prefix = '',
  withCurrencySymbol = true,
  onChange,
}: Props): ReturnType<typeof useRifm> {
  const [tempValue, setTempValue] = useState<[string, MoneyInputValue]>()

  const separator = getDecimalSeparator()

  // If value comes from outside we discard tmp value as it no longer needed
  // also react will not trigger update if tmp value is same as previous
  useLayoutEffect(() => {
    setTempValue((prev) => {
      return prev?.[1] === value ? prev : undefined
    })
  }, [value])

  const handleFormat = useHandleFormat(currency, prefix, withCurrencySymbol)
  const handleChange = useHandleChange(currency, value, onChange, setTempValue)

  return useRifm({
    accept: new RegExp(`[\\d${separator}]`, 'g'),
    format: handleFormat,
    onChange: handleChange,
    value: tempValue ? tempValue[0] : handleFormat(value),
  })
}
