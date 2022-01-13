import { subMonths, isSameYear, startOfMonth, endOfMonth, isValid, parse } from 'date-fns'

import { TopupCardExpiryYearFormat } from '@revolut/rwa-core-types'

import { getCurrentIntlLocale } from '../i18n'
import { DateFormat } from './dateFormat'

export const getNameOfPastMonth = (
  numberOfMonthsFromNow = 1,
  showYear: boolean,
  formatDate: any,
  locale: string,
) => {
  const date = subMonths(Date.now(), numberOfMonthsFromNow)
  const shouldShowYear = showYear && !isSameYear(date, new Date())

  return formatDate(date, shouldShowYear, true, locale)
}

export const getYearOfPastMonth = (n = 1, formatDate: any, locale: string) => {
  const date = subMonths(Date.now(), n)
  return !isSameYear(date, new Date()) ? formatDate(date, true, false, locale) : ''
}

export const getStartAndEndOfPastMonthMonth = (numberOfMonthsFromNow: number) => {
  const d = subMonths(new Date(), numberOfMonthsFromNow)
  return {
    from: Number(startOfMonth(d)),
    to: Number(endOfMonth(d)),
  }
}

export const getDateFnsFormatCurrentLocale = () => getCurrentIntlLocale().replace('-', '')

export type ExpiryDate = { month: string; year: string }

export const parseExpiryDate = (
  value: string,
  expiryYearFormat: TopupCardExpiryYearFormat,
): ExpiryDate => {
  const parts = value.split('/')
  const year =
    expiryYearFormat === TopupCardExpiryYearFormat.Full ? `20${parts[1]}` : parts[1]

  return {
    month: parts[0],
    year,
  }
}

const LOCALE_DATE_OPTIONS = { month: 'short', day: 'numeric' } as const

export const formatLocaleISODate = (isoDate: string, locale: string) =>
  new Date(isoDate).toLocaleDateString(locale, LOCALE_DATE_OPTIONS)

export const getLocaleMonthFromNumber = (monthIndex: number, locale: string) => {
  const monthIndexFrom0 = monthIndex - 1

  const objDate = new Date()
  objDate.setDate(1)
  objDate.setMonth(monthIndexFrom0)

  return objDate.toLocaleString(locale, { month: 'long' })
}

export const checkApiDate = (date?: string | null): boolean =>
  isValid(parse(date || '', DateFormat.ApiRequest, new Date()))

export const getFirstDayOfDateMonth = (date: Date) => new Date(date.setDate(1))

export const isDateCurrentMonth = (date: Date) => {
  const currentDate = new Date()

  return (
    date.getMonth() === currentDate.getMonth() &&
    date.getFullYear() === currentDate.getFullYear()
  )
}
