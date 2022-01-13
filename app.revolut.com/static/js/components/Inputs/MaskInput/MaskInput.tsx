import { FC, useCallback, useRef } from 'react'

import { TextInput, TextInputProps } from '@revolut/rwa-core-components'

enum MaskInputType {
  Number = 'number',
}

export type MaskInputProps = {
  mask: string
  label: string
  inputType?: MaskInputType
  onChange: (value: string) => void
  inputProps?: TextInputProps
}

export enum MaskInputTestId {
  MaskInput = 'mask-input',
}

const parseFunctions = {
  [MaskInputType.Number]: (val: string) => val.replace(/[^\d]/g, ''),
}

export const MaskInput: FC<MaskInputProps> = ({
  mask,
  label,
  inputType = MaskInputType.Number,
  onChange,
  inputProps,
}) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleBlur = useCallback(() => {
    inputRef.current?.removeAttribute?.('placeholder')
  }, [])

  const handleFocus = useCallback(() => {
    inputRef.current?.setAttribute?.('placeholder', mask)
  }, [mask])

  const handleChange = useCallback(
    ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
      onChange(value)
    },
    [onChange],
  )

  return (
    <TextInput
      data-testid={MaskInputTestId.MaskInput}
      ref={inputRef}
      placeholder={label}
      maskPattern={mask}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      parseFn={parseFunctions[inputType]}
      {...inputProps}
    />
  )
}
