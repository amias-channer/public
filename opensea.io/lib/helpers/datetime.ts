import moment, { Duration, Moment } from "moment-timezone"

export const fromNowWithSeconds = (timestamp: Moment): string => {
  const timeDiff = Math.abs(moment().diff(timestamp.local()))
  return timeDiff < 44000
    ? Math.round(timeDiff / 1000) + " seconds ago"
    : timestamp.local().fromNow()
}

export const getCurrentTimestamp = (): number => moment().unix()

export const fromISO8601 = (datetime: string): Moment =>
  moment.utc(datetime, moment.ISO_8601)

const padSingleDigit = (n: number): string =>
  `${n <= 9 ? "0" : ""}${Math.max(0, n)}`

export const formatDuration = (duration: Duration) =>
  `${
    duration.days() > 0 ? padSingleDigit(duration.days()) + ":" : ""
  }${padSingleDigit(duration.hours())}:${padSingleDigit(
    duration.minutes(),
  )}:${padSingleDigit(duration.seconds())}`

export const fromEpoch = (epoch: number): Moment => moment.unix(epoch).utc()

export const inRange = (
  value: Moment,
  { min, max }: { min?: Moment; max?: Moment },
) => {
  const isSameOrAfterMin = min ? value.isSameOrAfter(min, "date") : true
  const isSameOrBeforeMax = max ? value.isSameOrBefore(max, "date") : true

  return isSameOrAfterMin && isSameOrBeforeMax
}
