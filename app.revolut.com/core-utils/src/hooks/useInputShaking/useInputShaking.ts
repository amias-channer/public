import { useCallback, useState } from 'react'

export const useInputShaking = (stopAfter: number) => {
  const [isInputShaking, setInputShaking] = useState(false)

  const shakeInput = useCallback(() => {
    setInputShaking(true)

    setTimeout(() => {
      setInputShaking(false)
    }, stopAfter)
  }, [stopAfter, setInputShaking])

  return {
    shakeInput,
    isInputShaking,
  }
}
