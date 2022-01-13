import { Dispatch, SetStateAction, useCallback, useState } from 'react'

import { useIsMounted } from '../useIsMounted'

type SetStateFunction<ValueType> = Dispatch<SetStateAction<ValueType>>

export function useMountedState<StateValue>(
  initialValue?: StateValue,
): [StateValue | undefined, SetStateFunction<StateValue>] {
  const [stateValue, setStateValue] = useState<StateValue | undefined>(initialValue)
  const isMounted = useIsMounted()

  const handleStateChange = useCallback(
    (newStateValue) => {
      if (isMounted.current) {
        setStateValue(newStateValue)
      }
    },
    [isMounted],
  )

  return [stateValue, handleStateChange]
}
