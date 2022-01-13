import React from "react"
import { isURL } from "../../lib/helpers/urls"
import ValidatedInput from "./ValidatedInput.react"

interface Props {
  children?: React.ReactNode
  className?: string
  disabled?: boolean
  inputValue: string
  onChange: (values: { value?: string; inputValue: string }) => unknown
  placeholder?: string
  prefix?: string
  value?: string
  id?: string
  name?: string
}

export const URLInput = ({
  children,
  disabled,
  className,
  inputValue,
  onChange,
  placeholder,
  prefix,
  value,
  id,
  name,
}: Props) => {
  const match = inputValue.match(new RegExp(`${prefix}(.*)`))
  return (
    <ValidatedInput
      className={className}
      disabled={disabled}
      errorInfo="Invalid url."
      id={id}
      inputValue={match ? match[1] : inputValue}
      name={name}
      placeholder={placeholder}
      prefix={prefix}
      resolve={inputValue => {
        let url = `${prefix ?? ""}${inputValue}`
        if (!prefix && inputValue && !/^https?:\/\//.test(inputValue)) {
          url = `http://${inputValue}`
        }
        if (prefix && url === prefix) {
          url = ""
        }
        return isURL(url) ? url : ""
      }}
      value={value}
      onChange={onChange}
    >
      {children}
    </ValidatedInput>
  )
}

export default URLInput
