import { forwardRef } from 'react'
import { useRifm } from 'rifm'
import { InputProps, PasswordInput } from '@revolut/ui-kit'

import { CardCvvHintIcon } from '../../Icons'
import { formatCvv } from './utils'

type CardCvvInputProps = Omit<InputProps, 'value' | 'onChange'> & {
  value: string
  onChange: (value: string) => void
}

const CardCvvInput = forwardRef<HTMLInputElement, CardCvvInputProps>(
  ({ value, onChange, ...restProps }, ref) => {
    const rifm = useRifm({
      format: formatCvv,
      value,
      accept: /\d/g,
      onChange,
    })

    return (
      <PasswordInput
        placeholder="CVV"
        autoComplete="off"
        variant="filled"
        renderAction={() => <CardCvvHintIcon />}
        {...rifm}
        {...restProps}
        ref={ref}
      />
    )
  },
)

CardCvvInput.displayName = 'CardCvvInput'

export { CardCvvInput }
