import { useRef, useEffect, useCallback } from 'react'
import { useBoolean } from 'react-hanger/array'

type Values = {
  isTransition: boolean
}

type Actions = {
  setTransition: () => void
}

export function useTransition(): [Values, Actions] {
  const [isTransition, isTransitionActions] = useBoolean(true)

  const transitionTimeout = useRef<number>()

  useEffect(() => {
    return () => {
      clearTimeout(transitionTimeout.current)
    }
  }, [])

  const setTransition = useCallback(() => {
    isTransitionActions.setTrue()

    transitionTimeout.current = setTimeout(isTransitionActions.setFalse, 600)
  }, [isTransitionActions])

  return [{ isTransition }, { setTransition }]
}
