import { differenceInCalendarMonths, startOfMonth, endOfDay } from 'date-fns'
import { TFunction } from 'i18next'
import { range, capitalize } from 'lodash'
import { useState, useMemo } from 'react'

import {
  getNameOfPastMonth,
  getYearOfPastMonth,
  getStartAndEndOfPastMonthMonth,
} from '@revolut/rwa-core-utils'

import { Filter } from '../providers'
import { formatDate, formatDateDay } from './helpers'

const useLast30DaysOption = (t: TFunction) => {
  const dateNow = useMemo(() => new Date(), [])
  const date30DaysAgo = new Date().setDate(dateNow.getDate() - 30)
  const label = t('TransactionsTab.filter.last30Days')

  return useMemo(
    () => ({
      label,
      optionLabel: capitalize(label),
      hint: '',
      value: { from: +date30DaysAgo, to: +dateNow },
    }),
    [date30DaysAgo, label, dateNow],
  )
}

const useSinceTheBeginningOption = (accountCreationDate: number, t: TFunction) => {
  const from = accountCreationDate

  const label = t('TransactionsTab.filter.filterByDateStartOfAccountActivity')

  return useMemo(
    () => ({
      label,
      optionLabel: capitalize(label),
      hint: '',
      value: { from, to: endOfDay(new Date()).getTime() },
    }),
    [from, label],
  )
}

const useThisMonthOption = (t: TFunction) => {
  const hintFrom = formatDateDay(startOfMonth(new Date()))
  const hintTo = formatDateDay(new Date())

  return {
    label: t('TransactionsTab.filter.filterByDateThisMonthLabel'),
    optionLabel: t('TransactionsTab.filter.filterByDateThisMonthOptionLabel'),
    hint: `${hintFrom} — ${hintTo}`,
    value: getStartAndEndOfPastMonthMonth(0),
  }
}

const useFilterByDateOptionsLast30Days = (t: TFunction) => {
  const last30DaysOption = useLast30DaysOption(t)
  return [last30DaysOption]
}

export const useFilterByDateOptions = (
  accountCreationDate: number,
  t: TFunction,
  locale: string,
  isFromStartOfAccountActivity?: boolean,
) => {
  const monthsSinceCreation = differenceInCalendarMonths(new Date(), accountCreationDate)
  const monthsRange = range(1, monthsSinceCreation + 1)
  const rangeItems = monthsRange.map((monthNumber) => ({
    label: getNameOfPastMonth(monthNumber, true, formatDate, locale),
    optionLabel: capitalize(getNameOfPastMonth(monthNumber, false, formatDate, locale)),
    hint: getYearOfPastMonth(monthNumber, formatDate, locale),
    value: getStartAndEndOfPastMonthMonth(monthNumber),
  }))

  const sinceTheBeginningOption = useSinceTheBeginningOption(accountCreationDate, t)
  const thisMonthOption = useThisMonthOption(t)
  if (isFromStartOfAccountActivity) {
    return [sinceTheBeginningOption, thisMonthOption, ...rangeItems]
  }
  return [thisMonthOption, ...rangeItems]
}

export const useTransactionsListFilterByDate = (
  date: number,
  t: TFunction,
  locale: string,
  isRestrictedAccessToken?: boolean,
  isFromStartOfAccountActivity?: boolean,
) => {
  const limitedOptions = useFilterByDateOptionsLast30Days(t)
  const allOptions = useFilterByDateOptions(date, t, locale, isFromStartOfAccountActivity)
  const relevantOptions = isRestrictedAccessToken ? limitedOptions : allOptions
  const [firstOption] = relevantOptions
  const [value, setFilterValue] = useState(firstOption.value)

  const isDefaultOption =
    new Date(value.to).getTime() === new Date(firstOption.value.to).getTime() &&
    new Date(value.from).getTime() === new Date(firstOption.value.from).getTime()

  return {
    name: 'dateFilter',
    value,
    options: relevantOptions,
    setFilterValue,
    isDefaultOption,
  }
}

export const useTransactionsListFiltersState = (
  ...filters: Filter[]
): {
  [key: string]: Filter
} =>
  filters.reduce((acc, filter) => {
    if (acc[filter.name]) {
      throw Error(`${filter.name} already exists`)
    }

    acc[filter.name] = filter

    return acc
  }, {})
