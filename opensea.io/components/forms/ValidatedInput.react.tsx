import React, { useCallback, useState } from "react"
import { debounce, DebounceSettings } from "lodash"
import { useUpdateEffect } from "react-use"
import Input from "../v2/inputs/Input.react"

export interface Data<T> {
  inputValue: string
  value: T | undefined
}

export type ValidatedInputProps<T> = {
  children?: React.ReactNode
  onBlur?: () => unknown
  onChange: (data: Data<T>) => unknown
  resolve: (inputValue: string) => T | undefined | Promise<T | undefined>
  resolveOptions?: { wait?: number } & DebounceSettings
  type?: string
} & Data<T> &
  Pick<
    Input["props"],
    | "className"
    | "disabled"
    | "errorInfo"
    | "inputClassName"
    | "containerClassName"
    | "inputMode"
    | "isRequired"
    | "placeholder"
    | "prefix"
    | "valueInfo"
    | "min"
    | "max"
    | "right"
    | "autoFocus"
    | "id"
    | "name"
  >

export const ValidatedInput = <T,>({
  children,
  className,
  disabled,
  errorInfo,
  inputClassName,
  containerClassName,
  inputMode,
  inputValue,
  isRequired,
  onChange,
  onBlur,
  max,
  min,
  placeholder,
  prefix,
  resolve,
  resolveOptions,
  right,
  type,
  value,
  valueInfo,
  autoFocus,
  id,
  name,
}: ValidatedInputProps<T>) => {
  const [status, setStatus] = useState<Input["props"]["status"]>("standby")

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedResolve = useCallback(
    debounce(
      async inputValue => {
        const resolution = resolve(inputValue)
        if (resolution instanceof Promise) {
          const value = await resolution
          setStatus(value === undefined ? "invalid" : "valid")
          onChange({ value, inputValue })
          return
        }
        setStatus("standby")
        onChange({ value: resolution, inputValue })
        return
      },
      resolveOptions?.wait,
      {
        ...resolveOptions,
      },
    ),
    [resolve],
  )

  const handleChange = async (inputValue: string) => {
    const resolution = debouncedResolve(inputValue)
    if (resolution instanceof Promise) {
      setStatus("wait")
    }
    onChange({ value: undefined, inputValue })
    await resolution
  }

  useUpdateEffect(() => {
    handleChange(inputValue)
  }, [min, max])

  return (
    <Input
      autoFocus={autoFocus}
      className={className}
      containerClassName={containerClassName}
      disabled={disabled}
      errorInfo={errorInfo}
      id={id}
      inputClassName={inputClassName}
      inputMode={inputMode}
      isRequired={isRequired}
      max={max}
      min={min}
      name={name}
      placeholder={placeholder}
      prefix={prefix}
      right={right}
      status={status}
      type={type}
      value={inputValue}
      valueInfo={valueInfo}
      onBlur={() => {
        onBlur?.()
        status !== "wait" &&
          setStatus(value ? "valid" : inputValue ? "invalid" : "standby")
      }}
      onChange={handleChange}
    >
      {children}
    </Input>
  )
}

export default ValidatedInput
