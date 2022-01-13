import { OptionType } from '@revolut/ui-kit'

import { LoaderDots } from '../../LoaderDots'
import { InputSelectStyled } from './styled'
import { InputSelectProps } from './types'

export function InputSelect<Value, Option extends OptionType<Value> = OptionType<Value>>({
  className,
  options,
  isFetching = false,
  placeholder,
  inputProps,
}: InputSelectProps<Value, Option>) {
  return (
    <InputSelectStyled<Value, Option>
      className={className}
      placeholder={placeholder}
      variant="filled"
      renderLabel={isFetching ? () => <LoaderDots /> : undefined}
      disabled={isFetching}
      {...inputProps}
      options={options}
    />
  )
}
