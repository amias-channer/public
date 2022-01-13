import React, { FC, useCallback, useState } from 'react'
import { Input, Popup, Calendar } from '@revolut/ui-kit'
import * as Icons from '@revolut/icons'
import { format } from 'date-fns'

import { DateValue } from '../../../types'
import { useWidgetInputVariant } from '../../../providers'

const displayDateFormat = 'dd/MM/yyyy'
const serverDateFormat = 'yyyy-MM-dd'

type Props = {
  value?: Pick<DateValue, 'value'>
  disabled: boolean
  hint?: string
  changeValue: (value: DateValue['value']) => void
}

const DateInput: FC<Props> = ({ value, disabled, changeValue, hint }) => {
  const inputVariant = useWidgetInputVariant()
  const [isCalendarOpen, setCalendarOpen] = useState(false)

  const handleChange = useCallback(
    (date: Date | null | undefined) => {
      changeValue(date ? format(date, serverDateFormat) : '')
      setCalendarOpen(false)
    },
    [changeValue],
  )

  return (
    <>
      <Input
        variant={inputVariant}
        type="button"
        placeholder={hint || 'Select date'}
        useIcon={Icons.CalendarDate}
        onClick={() => setCalendarOpen(true)}
        disabled={disabled}
        value={value?.value ? format(new Date(value.value), displayDateFormat) : ''}
      />
      <Popup
        isOpen={isCalendarOpen}
        onExit={() => setCalendarOpen(false)}
        variant="bottom-sheet"
      >
        <Calendar
          value={value?.value ? new Date(value.value) : undefined}
          onChange={handleChange}
          labelEmptyValue="Select date"
          labelButtonClear="Clear"
        />
      </Popup>
    </>
  )
}

export default DateInput
