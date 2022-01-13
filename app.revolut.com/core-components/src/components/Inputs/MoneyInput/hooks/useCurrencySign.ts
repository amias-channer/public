import { Currency } from '@revolut/rwa-core-types'

import { useFormatMoneyToParts } from './useFormatMoneyToParts'

const AMOUNT = 100

const isCurrencyPart = ({ type }: Intl.NumberFormatPart) => {
  const partsToCheck: Intl.NumberFormatPartTypes[] = ['currency', 'literal']

  return partsToCheck.includes(type)
}

export function useCurrencySign(currency: Currency) {
  const formatMoneyToParts = useFormatMoneyToParts()

  const parts =
    formatMoneyToParts({
      amount: AMOUNT,
      currency,
    }) || []

  return parts
    .filter(isCurrencyPart)
    .map(({ value }) => value)
    .join('')
}
