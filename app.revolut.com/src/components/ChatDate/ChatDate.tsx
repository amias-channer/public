import * as React from 'react'
import { FormattedDate } from 'react-intl'
import { isSameMonth, isSameYear } from 'date-fns'

export const ChatDate = ({ date }: { date: Date | number | string }) => {
  const now = Date.now()

  return (
    <FormattedDate
      value={date}
      weekday={isSameMonth(now, date) ? 'short' : undefined}
      day='numeric'
      month='short'
      year={!isSameYear(now, date) ? 'numeric' : undefined}
    />
  )
}
