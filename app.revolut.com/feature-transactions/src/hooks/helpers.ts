import { format } from 'date-fns'
import * as locales from 'date-fns/locale'

import { DateFormat } from '@revolut/rwa-core-utils'

const getDateFormat = (shouldShowYear: boolean, shouldShowMonth: boolean) => {
  if (shouldShowYear && shouldShowMonth) {
    return DateFormat.TransactionsFilterOptionWithMonthAndYear
  }

  if (shouldShowYear) {
    return DateFormat.TransactionsFilterOptionWithYear
  }

  return DateFormat.TransactionsFilterOptionWithMonth
}

export const formatDate = (
  date: Date,
  shouldShowYear: boolean,
  shouldShowMonth: boolean,
  locale: string,
): string => {
  const dateFormat = getDateFormat(shouldShowYear, shouldShowMonth)

  return format(date, dateFormat, { locale: locales[locale] || locales.enGB })
}

export const formatDateDay = (date: Date) => {
  return format(date, DateFormat.TransactionsFilterOptionDay, { locale: locales.enGB })
}
