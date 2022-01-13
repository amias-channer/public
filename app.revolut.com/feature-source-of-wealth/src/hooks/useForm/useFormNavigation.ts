import { useCallback, useMemo } from 'react'
import { useHistory } from 'react-router-dom'

import { FormStateAction, UseFormNavigationArgs } from './types'

export const useFormNavigation = ({
  isAdditional,
  isLast,
  handleSubmit,
  transition,
  onBack,
  onNext,
  onAdditional,
}: UseFormNavigationArgs) => {
  const history = useHistory()

  const goNext = useCallback(() => {
    transition(FormStateAction.Forward, onNext)
  }, [transition, onNext])

  const goAdditional = useCallback(() => {
    transition(FormStateAction.Additional, onAdditional)
  }, [transition, onAdditional])

  const goBack = useCallback(() => {
    transition(FormStateAction.Back, () => {
      history.goBack()
      onBack?.()
    })
  }, [transition, onBack, history])

  const onContinue = useCallback(() => {
    if (isAdditional) {
      goAdditional()
      return
    }

    if (isLast) {
      handleSubmit()
      return
    }

    goNext()
  }, [goAdditional, goNext, handleSubmit, isAdditional, isLast])

  return useMemo(
    () => ({
      goNext,
      goAdditional,
      goBack,
      onContinue,
    }),
    [goAdditional, goBack, goNext, onContinue],
  )
}
