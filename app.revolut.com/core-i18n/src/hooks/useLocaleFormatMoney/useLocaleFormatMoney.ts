import { useCallback } from 'react'

import { formatMoney, MoneyFormatterOptions } from '@revolut/rwa-core-utils'

import { useLocale } from '../useLocale'

export const useLocaleFormatMoney = () => {
  const { locale } = useLocale()

  return useCallback(
    (
      amount: number,
      currency: string,
      moneyFormatterOptions?: Partial<MoneyFormatterOptions>,
    ) => {
      return formatMoney(amount, currency, locale, {
        withCurrency: true,
        useGrouping: true,
        ...moneyFormatterOptions,
      })
    },
    [locale],
  )
}
