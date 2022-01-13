import { forwardRef } from 'react'
import { InputInnerProps } from '@revolut/ui-kit'

import { Currency } from '@revolut/rwa-core-types'

import { TextInput } from '../TextInput'
import { useFormatMoneyInput } from './hooks'
import { MoneyInputValue } from './types'

type MoneyInputProps = InputInnerProps & {
  currency: Currency
  prefix?: string
  withCurrencySymbol?: boolean
  autoFocus?: boolean
  title?: string
  value: MoneyInputValue
  onChange: (value: MoneyInputValue) => void
}

export const MoneyInput = forwardRef<HTMLInputElement, MoneyInputProps>(
  ({ currency, prefix, withCurrencySymbol, value, onChange, ...restProps }, ref) => {
    const formatMoneyInputProps = useFormatMoneyInput({
      currency,
      prefix,
      withCurrencySymbol,
      value: value as string,
      onChange,
    })

    return (
      <TextInput
        ref={ref}
        autoComplete="off"
        type="text"
        inputMode="decimal"
        {...formatMoneyInputProps}
        {...restProps}
      />
    )
  },
)
