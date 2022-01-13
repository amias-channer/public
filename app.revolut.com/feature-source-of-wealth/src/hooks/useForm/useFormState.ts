import { keys, head } from 'lodash'
import { useState, useCallback } from 'react'

import { FormStateDefinition, FormNavigationTransition, FormStates } from './types'

const getFirstKeyOfStates = <T extends string>(states: FormStates<T>) => {
  return (head(keys(states)) ?? '') as T
}

export const useFormState = <T extends string>({
  initialState,
  states,
}: FormStateDefinition<T>) => {
  const initial = initialState ?? getFirstKeyOfStates<T>(states)
  const [state, setState] = useState(initial)

  const handleTransition: FormNavigationTransition = useCallback(
    (action, fallbackAction) => {
      const currentState = states[state]
      const forwardDestination = currentState?.actions?.[action]

      if (!forwardDestination) {
        fallbackAction?.()
        return
      }

      const destinationState = forwardDestination.target
      forwardDestination.onAction?.()

      setState(destinationState)
    },
    [states, state],
  )

  const handleReset = () => {
    setState(initial)
  }

  return {
    state,
    transition: handleTransition,
    reset: handleReset,
  }
}
