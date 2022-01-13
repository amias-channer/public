import isNil from 'lodash/isNil'
import { FC, useState, ClipboardEvent } from 'react'
import { Flex, useMultipleCodeInput } from '@revolut/ui-kit'

import { SECURITY_CODE_LENGTH } from '@revolut/rwa-core-utils'

import { MultipleDigitInput } from './MultipleDigitInput'
import { ErrorMessageStyled, ContainerStyled } from './styled'
import { useInputFocus } from './useInputFocus'

export type MultipleCodeInputProps = {
  size: 4 | 6
  value?: string
  defaultValue?: string
  errorMessage?: string
  isInputShaking?: boolean
  disabled?: boolean
  onChange: (value: string) => void
}

const INPUT_PATTERN = new RegExp('^\\d$')

export const MultipleCodeInput: FC<MultipleCodeInputProps> = ({
  size,
  value: propsValue,
  defaultValue = '',
  errorMessage,
  isInputShaking = false,
  disabled,
  onChange,
}) => {
  const [stateValue, setStateValue] = useState(defaultValue)

  const isValueControlled = !isNil(propsValue)
  const currentValue = (isValueControlled ? propsValue : stateValue) as string

  const handleInputChange = (value: string) => {
    onChange(value)

    if (!isValueControlled) {
      setStateValue(value)
    }
  }

  const inputsProps = useMultipleCodeInput({
    autoFocus: true,
    size,
    value: currentValue,
    onChange: handleInputChange,
  })

  useInputFocus({ inputsProps, size, currentValue, isInputShaking })

  const handleCodePaste = (e: ClipboardEvent<HTMLDivElement>) => {
    if (e.clipboardData) {
      const code = e.clipboardData.getData('text/plain')

      if (
        code.length === SECURITY_CODE_LENGTH &&
        code.split('').every((codePart) => INPUT_PATTERN.test(codePart))
      ) {
        handleInputChange(code)
      }
    }
  }

  const isPasteEnabled = size === SECURITY_CODE_LENGTH

  return (
    <ContainerStyled
      digitsAmount={size}
      isShaking={isInputShaking}
      onPaste={isPasteEnabled ? handleCodePaste : undefined}
    >
      <Flex alignItems="center">
        <MultipleDigitInput inputsProps={inputsProps} size={size} disabled={disabled} />
      </Flex>
      {errorMessage && <ErrorMessageStyled>{errorMessage}</ErrorMessageStyled>}
    </ContainerStyled>
  )
}
