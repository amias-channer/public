import { forwardRef, useCallback } from 'react'

import { TextInput, TextInputProps } from '@revolut/rwa-core-components'

type NumberInputProps = TextInputProps

const patchEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
  e.target.value = e.target.value.replace(/\D/g, '')

  return e
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  ({ onChange, ...restProps }, ref) => {
    const onChangeProxy = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        // Should not be inlined.
        const patchedEvent = patchEvent(e)

        onChange?.(patchedEvent)
      },
      [onChange],
    )

    return (
      <TextInput
        ref={ref}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        onChange={onChangeProxy}
        {...restProps}
      />
    )
  },
)
