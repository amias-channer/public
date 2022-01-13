import { useCallback } from 'react'
import NumberFormat, { NumberFormatProps } from 'react-number-format'

import {
  getDecimalSeparator,
  getThousandSeparator,
  parseFloatNumber,
} from '@revolut/rwa-core-utils'

type Props = Omit<NumberFormatProps, 'onChange'> & {
  onChange: (value: number | undefined) => void
}

export const WealthQuantityInput = ({
  value,
  decimalScale,
  onChange,
  ...rest
}: Props) => {
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      onChange(parseFloatNumber(event.target.value))
    },
    [onChange],
  )

  return (
    <NumberFormat
      decimalScale={decimalScale}
      value={value === undefined ? '' : value}
      {...rest}
      onChange={handleChange}
      decimalSeparator={getDecimalSeparator()}
      thousandSeparator={getThousandSeparator()}
    />
  )
}
