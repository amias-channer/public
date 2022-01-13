import * as R from 'ramda'
import {
  addDays,
  addMinutes,
  formatDistance,
  isAfter,
  isWithinInterval,
  parse,
} from 'date-fns/fp'

export const SUPPORT_TIME = {
  SUNDAY: {
    from: '10:00',
    to: '18:00',
  },
  MONDAY: {
    from: '06:00',
    to: '23:59',
  },
  TUESDAY: {
    from: '00:00',
    to: '23:59',
  },
  WEDNESDAY: {
    from: '00:00',
    to: '23:59',
  },
  THURSDAY: {
    from: '00:00',
    to: '23:59',
  },
  FRIDAY: {
    from: '00:00',
    to: '22:00',
  },
  SATURDAY: {
    from: '10:00',
    to: '18:00',
  },
}

export const DAYS = Object.keys(SUPPORT_TIME)

export const getUTCtime = (date = new Date()) =>
  addMinutes(date.getTimezoneOffset(), date)

export const getSupportOnline = (weekHours: typeof SUPPORT_TIME) => {
  const today = new Date()
  const todayUTC = getUTCtime(today)
  const todayDay = DAYS[today.getUTCDay()]
  const start = parse(todayUTC, 'HH:mm', R.path([todayDay, 'from'], weekHours))
  const end = parse(todayUTC, 'HH:mm', R.path([todayDay, 'to'], weekHours))

  if (R.isNil(start.toJSON()) || R.isNil(end.toJSON())) {
    return true
  }

  return isWithinInterval({ start, end }, todayUTC)
}

export const getSupportArrivalTime = (weekHours: typeof SUPPORT_TIME) => {
  const today = new Date()
  const tomorrow = addDays(1, today)
  const todayUTC = getUTCtime(today)
  const tomorrowUTC = getUTCtime(tomorrow)

  const todayUTCDay = DAYS[today.getUTCDay()]
  const tomorrowUTCDay = DAYS[tomorrow.getUTCDay()]

  const startTimeToday = parse(
    todayUTC,
    'HH:mm',
    R.path([todayUTCDay, 'from'], weekHours)
  )
  const startTimeTomorrow = parse(
    tomorrowUTC,
    'HH:mm',
    R.path([tomorrowUTCDay, 'from'], weekHours)
  )

  if (R.isNil(startTimeToday.toJSON()) || R.isNil(startTimeTomorrow.toJSON())) {
    return 'soon'
  }

  if (isAfter(todayUTC, startTimeToday)) {
    return formatDistance(todayUTC, startTimeToday)
  }

  return formatDistance(todayUTC, startTimeTomorrow)
}
