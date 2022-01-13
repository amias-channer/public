import React from "react"
import moment, { Moment } from "moment"
import ValidatedInput, { ValidatedInputProps } from "./ValidatedInput.react"

const inRange = (
  value: Moment,
  { min, max }: { min?: Moment; max?: Moment },
) => {
  const isSameOrAfterMin = min ? value.isSameOrAfter(min, "date") : true
  const isSameOrBeforeMax = max ? value.isSameOrBefore(max, "date") : true

  return isSameOrAfterMin && isSameOrBeforeMax
}

export const HTML_DATE_FORMAT = "YYYY-MM-DD"

export type Props = {
  min?: Moment
  max?: Moment
} & Pick<
  ValidatedInputProps<Moment>,
  | "children"
  | "className"
  | "disabled"
  | "inputValue"
  | "isRequired"
  | "onChange"
  | "placeholder"
  | "value"
  | "right"
>

export const DateInput = ({
  children,
  className,
  disabled,
  inputValue,
  isRequired,
  min,
  max,
  onChange,
  right,
  placeholder,
  value,
}: Props) => (
  <ValidatedInput
    className={className}
    disabled={disabled}
    errorInfo={`Date must be ${
      min && max
        ? `between ${min.format("l")} and ${max.format("l")}`
        : min
        ? `on or after ${min?.format("l")}`
        : max
        ? `on or before ${max?.format("l")}`
        : ""
    }`}
    inputValue={inputValue}
    isRequired={isRequired}
    max={max?.format(HTML_DATE_FORMAT)}
    min={min?.format(HTML_DATE_FORMAT)}
    placeholder={placeholder}
    resolve={inputValue => {
      const value = moment(inputValue)

      return inRange(value, { min, max }) ? value : undefined
    }}
    right={right}
    type="date"
    value={value}
    onChange={onChange}
  >
    {children}
  </ValidatedInput>
)
export default DateInput
