import { FC } from 'react'
import { InputProps, Input } from '@revolut/ui-kit'

import { FormFieldGenericProps } from '@revolut/rwa-core-components'

type TextInputProps = FormFieldGenericProps & InputProps

export const TextInput: FC<TextInputProps> = ({
  error,
  isTouched,
  isErrorShown = true,
  ...rest
}) => (
  <Input
    message={isTouched && isErrorShown ? error : ''}
    hasError={isErrorShown && Boolean(error)}
    {...rest}
  />
)
