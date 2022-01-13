import { forwardRef } from 'react'
import { Input, InputProps } from '@revolut/ui-kit'

export type TextInputProps = InputProps

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>((props, ref) => (
  <Input ref={ref} type="text" variant="filled" {...props} />
))
