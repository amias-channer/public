import { DateFormat } from '@revolut/rwa-core-utils'

const sanitizeExpiryDate = (value: string) => value.replace(/[^\d]/g, '')

export type SupportedDateFormat =
  | DateFormat.CardExpireDateShort
  | DateFormat.MonthDayYear
  | DateFormat.DayMonthYear

export const formatDate = (
  value: string,
  prevValue: string,
  format: SupportedDateFormat,
) => {
  if (!value) {
    return ''
  }

  if (prevValue.length > value.length && prevValue.endsWith('/')) {
    return value.slice(0, -1)
  }

  const sanitizedValue = sanitizeExpiryDate(value)

  let formattedDate = sanitizedValue.substr(0, 4).replace(/(\d\d)/, '$1/')
  if (format === DateFormat.CardExpireDateShort) {
    // for an auto populated edge case
    if (sanitizedValue.length === 6) {
      return `${sanitizedValue.substr(0, 2)}/${sanitizedValue.substr(4, 2)}`
    }
  }

  if ([DateFormat.MonthDayYear, DateFormat.DayMonthYear].includes(format)) {
    formattedDate += sanitizedValue.length >= 4 ? `/${sanitizedValue.substr(4, 4)}` : ''
  }

  return formattedDate
}

export const moveInputCursorToValidPosition = (input: HTMLInputElement) => {
  const sanitizedValue = sanitizeExpiryDate(input.value ?? '')

  const slashCount = input.value.length - sanitizedValue.length
  const position =
    sanitizedValue.length > 1 ? sanitizedValue.length + slashCount : sanitizedValue.length

  input.setSelectionRange(position, position)
}
