import { VFC } from 'react'
import * as Icons from '@revolut/icons'

import { useModal } from '@revolut/rwa-core-components'

import { CalendarPopup } from './CalendarPopup'
import { InputStyled } from './styled'
import { formatDateValue } from './utils'

type CalendarInputProps = {
  title: string
  dateValue: Date
  from: Date
  to: Date
  onDateChange: (date: Date) => void
}

export const CalendarInput: VFC<CalendarInputProps> = ({
  title,
  dateValue,
  from,
  to,
  onDateChange,
}) => {
  const [showCalendarPopup, calendarPopupProps] = useModal()

  const handleDateChange = (date: Date) => {
    onDateChange(date)
  }

  return (
    <>
      <InputStyled
        variant="grey"
        type="button"
        label={title}
        useIcon={Icons.CalendarDate}
        onClick={showCalendarPopup}
        value={formatDateValue(dateValue)}
      />
      <CalendarPopup
        {...calendarPopupProps}
        title={title}
        defaultValue={dateValue}
        from={from}
        to={to}
        onDateChange={handleDateChange}
      />
    </>
  )
}
