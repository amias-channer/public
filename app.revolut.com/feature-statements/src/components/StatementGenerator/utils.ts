import { format } from 'date-fns'

import { DateFormat, getFirstDayOfDateMonth } from '@revolut/rwa-core-utils'

export const formatDate = (date: Date) => format(date, DateFormat.ApiRequest)

export const firstDayOfCurrentMonth = () => getFirstDayOfDateMonth(new Date())
