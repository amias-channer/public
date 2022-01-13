import React from "react"
import ValidatedInput from "./ValidatedInput.react"

interface Props {
  className?: string
  containerClassName?: string
  inputValue: string
  onChange: (values: { value?: string; inputValue: string }) => unknown
  placeholder?: string
  value: string | undefined
}

function isValidEmail(email: string): boolean {
  const regexp = new RegExp(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  )
  return regexp.test(email)
}

export default class EmailInput extends React.Component<Props> {
  render() {
    const {
      className,
      onChange,
      placeholder,
      value,
      inputValue,
      containerClassName,
    } = this.props
    return (
      <ValidatedInput
        className={className}
        containerClassName={containerClassName}
        errorInfo="Invalid email."
        inputValue={inputValue}
        placeholder={placeholder}
        resolve={inputValue =>
          isValidEmail(inputValue) ? inputValue : undefined
        }
        value={value}
        onChange={onChange}
      />
    )
  }
}
