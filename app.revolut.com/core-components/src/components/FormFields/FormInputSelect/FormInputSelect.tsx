import { OptionType } from '@revolut/ui-kit'

import { FormFieldGenericProps } from '../../Form'
import { InputSelectProps } from '../../Inputs'

import { InputSelectStyled } from './styled'

export function FormInputSelect<
  Value = string,
  Option extends OptionType<Value> = OptionType<Value>,
>({
  value,
  error,
  isTouched,
  onChange,
  inputProps,
  ...rest
}: FormFieldGenericProps<InputSelectProps<Value, Option>>) {
  return (
    <InputSelectStyled<Value, Option>
      inputProps={{ ...inputProps, value, onChange }}
      {...rest}
    />
  )
}
