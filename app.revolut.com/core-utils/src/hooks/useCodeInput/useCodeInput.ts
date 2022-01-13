import { useCallback, useEffect, useState } from 'react'

import { useInputShaking } from '../useInputShaking'

const INPUT_SHAKING_TIMEOUT = 1000

type UseInputErrorShakingArgs = {
  shakingTimeout?: number
  errorMessage?: string
  onErrorMessageClear?: VoidFunction
}

type UseInputErrorShakingReturn = {
  inputValue: string
  isInputShaking: boolean
  onInputChange: (value: string) => void
}

export const useCodeInput = ({
  shakingTimeout = INPUT_SHAKING_TIMEOUT,
  errorMessage,
  onErrorMessageClear,
}: UseInputErrorShakingArgs): UseInputErrorShakingReturn => {
  const [inputValue, setInputValue] = useState('')
  const { shakeInput, isInputShaking } = useInputShaking(shakingTimeout)

  useEffect(() => {
    if (errorMessage) {
      shakeInput()
      setInputValue('')
    }
  }, [errorMessage, shakeInput])

  const handleInputChange = useCallback(
    (value: string) => {
      setInputValue(value)

      if (errorMessage) {
        onErrorMessageClear?.()
      }
    },
    [errorMessage, onErrorMessageClear],
  )

  return {
    inputValue,
    isInputShaking,
    onInputChange: handleInputChange,
  }
}
