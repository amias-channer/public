/*
is used for parsing ISO duration format 'PyYmMwWdDThHmMsS'
idea was taken from https://github.com/moment/luxon/blob/9f23519dececcd76addab1010ab05d815a0a83cd/src/duration.js
 */
import differenceInDays from 'date-fns/differenceInDays'
import * as Sentry from '@sentry/react'

const isoDurationRegex =
  /^P(?:(?:(-?\d{1,9})Y)?(?:(-?\d{1,9})M)?(?:(-?\d{1,9})W)?(?:(-?\d{1,9})D)?(?:T(?:(-?\d{1,9})H)?(?:(-?\d{1,9})M)?(?:(-?\d{1,20})(?:[.,](-?\d{1,9}))?S)?)?)$/

const parseInteger = (stringDuration: string) => {
  if (!stringDuration) {
    return 0
  }

  return parseInt(stringDuration, 10)
}

type ParsedISODuration = {
  years: number
  months: number
  weeks: number
  days: number
} | null

export class Duration {
  parsedIsoDuration: ParsedISODuration

  constructor(isoDuration: string) {
    this.parsedIsoDuration = Duration.parseISODuration(isoDuration)
  }

  private static extractISODuration(match: RegExpExecArray) {
    const [, yearStr, monthStr, weekStr, dayStr] = match

    return {
      years: parseInteger(yearStr),
      months: parseInteger(monthStr),
      weeks: parseInteger(weekStr),
      days: parseInteger(dayStr),
    }
  }

  private static parseISODuration(isoDuration: string): ParsedISODuration {
    const match = isoDurationRegex.exec(isoDuration)

    if (!match) {
      Sentry.captureException(new Error(`iso duration ${isoDuration} is invalid`))
      return null
    }

    return Duration.extractISODuration(match)
  }

  static fromISO(isoDuration: string = ''): Duration {
    return new Duration(isoDuration)
  }

  days() {
    if (!this.parsedIsoDuration) {
      return 0
    }

    const { years, months, days } = this.parsedIsoDuration

    const currentDate = new Date()
    const futureDate = new Date(
      Date.UTC(
        currentDate.getFullYear() + years,
        currentDate.getMonth() + months,
        currentDate.getDate() + days,
      ),
    )

    return differenceInDays(futureDate, currentDate)
  }
}
