import React, { useRef, useState, useEffect } from "react"
import moment, { Moment } from "moment"
import { useClickAway } from "react-use"
import styled from "styled-components"
import Overflow from "../../components/common/Overflow.react"
import useIsOpen from "../../hooks/useIsOpen"
import { inRange } from "../../lib/helpers/datetime"
import { isInsideRef } from "../../lib/helpers/dom"
import Button from "../Button"
import { useTheme } from "../Context/ThemeContext"
import Input from "../Input"
import Popover from "../Popover"
import Calendar from "./Calendar.react"

export const HTML_DATE_FORMAT = "YYYY-MM-DD"
export const HTML_DATE_TIME_FORMAT = "YYYY-MM-DDTHH:mm"

const DUMMY_MAX_DATE = moment("9999-12-31")

export interface DatePickerProps {
  disabled?: boolean
  placeholder?: string
  value?: Moment
  min?: Moment
  max?: Moment
  withTime?: boolean
  onChange?: (date: Moment) => unknown
}

export const DatePicker = ({
  disabled,
  min,
  max,
  placeholder = "Select a date",
  value,
  withTime,
  onChange,
}: DatePickerProps) => {
  const format = withTime ? HTML_DATE_TIME_FORMAT : HTML_DATE_FORMAT
  const [showInput, setShowInput] = useState(false)
  const [inputValue, setInputValue] = useState(value?.format(format))
  const popoverRef = useRef<HTMLDivElement>(null)
  const { isOpen, open, close } = useIsOpen()
  const containerRef = useRef<HTMLInputElement>(null)
  const { theme } = useTheme()

  const onBlur = (target: EventTarget | null) => {
    if (!isInsideRef(popoverRef, target)) {
      close()
      setShowInput(false)
    }
  }

  useEffect(
    () => setInputValue(value?.format(format) ?? ""),
    [value, format, isOpen],
  )

  useClickAway(containerRef, event => {
    onBlur(event.target)
  })

  return showInput ? (
    <Popover
      arrow={false}
      content={() => (
        <div
          ref={popoverRef}
          role="dialog"
          tabIndex={0}
          onBlur={event => onBlur(event.relatedTarget)}
        >
          <Calendar
            date={value}
            max={max}
            min={min}
            withTime={withTime}
            onChange={date => {
              onBlur(null)
              onChange?.(date)
            }}
          />
        </div>
      )}
      contentPadding="0"
      placement="bottom-start"
      variant="card"
      visible={isOpen}
    >
      <StyledInput
        autoFocus
        disabled={disabled}
        // We use a dummy max date because HTML input dates allow 5+ digit years for some reason
        max={max?.format(format) ?? DUMMY_MAX_DATE.format(format)}
        min={min?.format(format)}
        ref={containerRef}
        type={withTime ? "datetime-local" : "date"}
        value={inputValue}
        onBlur={event => onBlur(event.relatedTarget)}
        onChange={({ target: { value } }) => {
          setInputValue(value)

          const valueAsMoment = moment(value)

          value &&
            valueAsMoment.isValid() &&
            inRange(valueAsMoment, { min, max }) &&
            onChange?.(valueAsMoment)
        }}
        onFocus={open}
      />
    </Popover>
  ) : (
    <Button
      disabled={disabled}
      icon="calendar_today"
      style={{ fontWeight: 500, width: "100%" }}
      textAlign="left"
      variant={theme === "dark" ? "secondary" : "tertiary"}
      onClick={() => setShowInput(true)}
      onFocus={() => setShowInput(true)}
    >
      <Overflow>
        {value ? value.format(withTime ? "lll" : "ll") : placeholder}
      </Overflow>
    </Button>
  )
}

export default DatePicker

const StyledInput = styled(Input)`
  input::-webkit-inner-spin-button,
  input::-webkit-calendar-picker-indicator {
    display: none;
    -webkit-appearance: none;
  }
`
