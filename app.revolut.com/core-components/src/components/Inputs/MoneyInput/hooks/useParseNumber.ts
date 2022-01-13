import isNumber from 'lodash/isNumber'
import isString from 'lodash/isString'
import { useCallback } from 'react'

import { getDecimalSeparator } from '@revolut/rwa-core-utils'

import { DOT } from '../constants'
import { MoneyInputValue } from '../types'

const sanitizeNumber = (input: string, separator: string) =>
  input.replace(new RegExp(`[^\\d${separator}]`, 'g'), '').replace(separator, DOT)

export function useParseNumber() {
  const separator = getDecimalSeparator()

  return useCallback(
    (input: MoneyInputValue) => {
      if (isNumber(input)) {
        return input
      }

      if (isString(input)) {
        const parsed = parseFloat(sanitizeNumber(input, separator))

        if (!isNaN(parsed)) {
          return parsed
        }
      }

      return undefined
    },
    [separator],
  )
}
