import { DOT } from '../constants'
import { getDecimalSeparator } from './getDecimalSeparator'
import { getThousandSeparator } from './getThousandSeparator'

export const parseFloatNumber = (value?: string) => {
  if (!value) {
    return undefined
  }

  const thousandSeparator = getThousandSeparator()
  const decimalSeparator = getDecimalSeparator()

  const replacedValue = value
    .replace(new RegExp(thousandSeparator === DOT ? '\\.' : thousandSeparator, 'g'), '')
    .replace(new RegExp(decimalSeparator === DOT ? '\\.' : decimalSeparator, 'g'), DOT)
    .replace(new RegExp(`[^\\d${DOT}]`, 'g'), '')

  const result = parseFloat(replacedValue)

  return isNaN(result) ? undefined : result
}
