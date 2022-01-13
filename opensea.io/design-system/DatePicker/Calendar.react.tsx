import React, { useEffect, useState } from "react"
import moment, { Moment } from "moment"
import TimeInput from "../../components/forms/TimeInput.react"
import Block from "../Block"
import Month from "./Month.react"

interface CalendarProps {
  date?: Moment
  min?: Moment
  max?: Moment
  withTime?: boolean
  onChange: (date: Moment) => unknown
}

const Calendar = ({ date, min, max, withTime, onChange }: CalendarProps) => {
  const [currentDate, setCurrentDate] = useState(
    date ?? moment().startOf("day"),
  )

  useEffect(() => date && setCurrentDate(date), [date])
  return (
    <Block>
      <Month.Header
        date={currentDate}
        max={max}
        min={min}
        onChange={setCurrentDate}
      />
      <Month
        date={currentDate}
        max={max}
        min={min}
        selectedDate={date}
        onChange={onChange}
      />
      {withTime && (
        <TimeInput
          max={max}
          min={min}
          style={{
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            borderLeft: 0,
            borderBottom: 0,
            borderRight: 0,
          }}
          value={date}
          onChange={onChange}
        />
      )}
    </Block>
  )
}

export default Calendar
