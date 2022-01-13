import React from "react"
import moment, { Moment } from "moment"
import styled from "styled-components"
import Input, { InputProps } from "../../design-system/Input"
import Icon from "../common/Icon.react"
import VerticalAligned from "../common/VerticalAligned.react"

export type TimeInputProps = Omit<
  InputProps,
  "value" | "onChange" | "min" | "max"
> & {
  className?: string
  min?: Moment
  max?: Moment
  value?: Moment
  onChange: (value: Moment) => unknown
}

const HTML_TIME_INPUT = "HH:mm"

export const TimeInput = ({
  className,
  min,
  max,
  value,
  onChange,
  ...inputProps
}: TimeInputProps) => {
  return (
    <StyledInput
      className={className}
      max={max?.format(HTML_TIME_INPUT)}
      min={min?.format(HTML_TIME_INPUT)}
      startEnhancer={
        <VerticalAligned marginRight="8px">
          <Icon color="gray" value="access_time" />
        </VerticalAligned>
      }
      type="time"
      value={value?.format(HTML_TIME_INPUT)}
      onChange={event => {
        const v = event.target.value

        const [hours, minutes] = v.split(":")

        v &&
          onChange(
            moment(value)
              .hours(+hours)
              .minutes(+minutes),
          )
      }}
      {...inputProps}
    />
  )
}

const StyledInput = styled(Input)`
  min-width: 160px;

  input[type="time"] {
    min-width: 100px;
    line-height: unset;
    &::-webkit-inner-spin-button,
    &::-webkit-calendar-picker-indicator {
      display: none;
      -webkit-appearance: none;
    }

    &::-webkit-datetime-edit {
      position: relative;
    }

    &::-webkit-date-time-edit-field,
    &::-webkit-datetime-edit-ampm-field {
      position: absolute;
      right: 10px;
    }

    &::-webkit-datetime-edit-text {
      margin: 0 5px;
    }
  }
`
export default TimeInput
