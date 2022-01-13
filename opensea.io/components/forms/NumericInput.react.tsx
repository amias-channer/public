import React from "react"
import { useUpdateEffect } from "react-use"
import {
  BigNumber,
  bn,
  isValidNumericInput,
} from "../../lib/helpers/numberUtils"
import ValidatedInput, {
  ValidatedInputProps,
  Data,
} from "./ValidatedInput.react"

type Props = {
  min?: BigNumber
  max?: BigNumber
  maxDecimals?: number
} & Pick<
  ValidatedInputProps<string>,
  | "children"
  | "className"
  | "disabled"
  | "inputClassName"
  | "inputValue"
  | "isRequired"
  | "onChange"
  | "placeholder"
  | "value"
  | "right"
  | "type"
  | "autoFocus"
  | "onBlur"
  | "id"
>

const NumericInput = ({
  children,
  className,
  disabled,
  inputClassName,
  inputValue,
  isRequired,
  min,
  max,
  maxDecimals,
  onChange,
  placeholder,
  value,
  right,
  type,
  autoFocus,
  onBlur,
  id,
}: Props) => {
  const handleChange = ({ value, inputValue }: Data<string>) => {
    if (!isValidNumericInput(inputValue, maxDecimals)) {
      return
    }

    if (
      (min && bn(inputValue).lessThan(min)) ||
      (max && bn(inputValue).greaterThan(max))
    ) {
      onChange({ value: undefined, inputValue })
    } else {
      onChange({ value: value ?? inputValue, inputValue })
    }
  }

  useUpdateEffect(() => {
    handleChange({ value, inputValue })
  }, [min?.toString(), max?.toString()])

  return (
    <ValidatedInput
      autoFocus={autoFocus}
      className={className}
      disabled={disabled}
      errorInfo={
        max && bn(inputValue).greaterThan(max)
          ? `Value cannot be more than ${max}.`
          : min && bn(inputValue).lessThan(min)
          ? `Value must be at least ${min}.`
          : undefined
      }
      id={id}
      inputClassName={inputClassName}
      inputMode={maxDecimals === 0 ? "numeric" : "decimal"}
      inputValue={inputValue}
      isRequired={isRequired}
      max={max?.toString()}
      min={min?.toString()}
      placeholder={placeholder}
      resolve={inputValue =>
        max && bn(inputValue).greaterThan(max) ? undefined : inputValue
      }
      right={right}
      type={type}
      value={value}
      onBlur={onBlur}
      onChange={handleChange}
    >
      {children}
    </ValidatedInput>
  )
}

export default NumericInput
