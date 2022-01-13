import { RefObject, useEffect } from 'react'

import { usePrevious } from '@revolut/rwa-core-utils'

const removeFocusFromInput = () => {
  ;(document.activeElement as HTMLInputElement)?.blur()
}

type InputProps = {
  ref: RefObject<HTMLInputElement>
}

type UseInputFocusArgs = {
  inputsProps: InputProps[]
  size: 4 | 6
  currentValue: string
  isInputShaking: boolean
}

export const useInputFocus = ({
  inputsProps,
  size,
  currentValue,
  isInputShaking,
}: UseInputFocusArgs) => {
  const isInputShakingPrev = usePrevious(isInputShaking)

  const firstInput = inputsProps[0].ref.current

  useEffect(() => {
    const isShakingEnded = !isInputShaking && isInputShaking !== isInputShakingPrev

    if (isShakingEnded) {
      firstInput?.focus()
    }
  }, [firstInput, isInputShaking, isInputShakingPrev])

  useEffect(() => {
    const isInputCompleted = currentValue.replace(/ /g, '').length === size

    if (isInputCompleted) {
      removeFocusFromInput()
    }
  }, [size, currentValue])
}
