import {
  isToday,
  isYesterday,
  isTomorrow,
  format as dateFnsFormat,
  isThisYear,
} from 'date-fns'
import * as locales from 'date-fns/locale'
import { getI18n } from 'react-i18next'

import { DateFormat } from './dateFormat'

const getFormatValue = (date: Date, format?: string) => {
  if (format) {
    return format
  }

  return isThisYear(date)
    ? DateFormat.TransactionsGroupDate
    : DateFormat.TransactionsGroupDateWithYear
}

export const getFormattedDate = (
  date: Date,
  format?: string,
  isRelative: boolean = true,
) => {
  const i18n = getI18n()

  if (isRelative) {
    if (isToday(date)) {
      return i18n.t('common:relativeDay.today')
    }

    if (isYesterday(date)) {
      return i18n.t('common:relativeDay.yesterday')
    }

    if (isTomorrow(date)) {
      return i18n.t('common:relativeDay.tomorrow')
    }
  }

  const locale = locales[i18n.language] || locales.enGB
  const formatValue = getFormatValue(date, format)
  return dateFnsFormat(date, formatValue, { locale })
}
