import React from "react"
import { isValidAddress } from "ethereumjs-util"
import { hasGraphQLResponseError } from "../../lib/graphql/error"
import { fetchAccount } from "../../lib/helpers/addresses"
import { isQualifiedName } from "../../lib/helpers/ens"
import ValidatedInput from "./ValidatedInput.react"

interface Props {
  className?: string
  inputValue: string
  onChange: (values: { value?: string; inputValue: string }) => unknown
  placeholder?: string
  value: string | undefined
  id?: string
}

export default class AddressInput extends React.Component<Props> {
  render() {
    const { className, onChange, placeholder, value, inputValue, id } =
      this.props
    return (
      <ValidatedInput
        className={className}
        errorInfo="Invalid address or ENS name."
        id={id}
        inputValue={inputValue}
        placeholder={placeholder}
        resolve={async inputValue => {
          if (isValidAddress(inputValue)) {
            return inputValue
          }
          if (isQualifiedName(inputValue)) {
            try {
              const account = await fetchAccount({ name: inputValue })
              return account?.address
            } catch (error) {
              if (hasGraphQLResponseError(error, 404)) {
                return undefined
              }
              throw error
            }
          }
          return undefined
        }}
        value={value}
        valueInfo={inputValue === value ? undefined : value}
        onChange={onChange}
      />
    )
  }
}
