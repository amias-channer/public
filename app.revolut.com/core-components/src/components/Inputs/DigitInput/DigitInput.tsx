import { forwardRef } from 'react'
import { Box, CodeInput } from '@revolut/ui-kit'

type DigitInputProps = {
  size: 4 | 6
  index: number
  value?: string
  disabled?: boolean
}

export const DigitInput = forwardRef<HTMLInputElement, DigitInputProps>(
  ({ size, index, value = '', ...rest }, ref) => {
    const isLastInputInGroup =
      size === 6 ? (index + 1) % (size / 2) === 0 : index === size - 1
    return (
      <Box mr={!isLastInputInGroup ? 's-8' : ''}>
        <CodeInput
          ref={ref}
          value={value}
          inputMode="numeric"
          pattern="[0-9]"
          {...rest}
        />
      </Box>
    )
  },
)
