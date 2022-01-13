import { RefObject, useCallback, useRef, useState } from "react"

export const useCallbackRef = <T>(): [RefObject<T>, (node: T) => void] => {
  const ref = useRef<T | null>(null)

  const [_initialize, setInitialize] = useState(false)
  const setRef = useCallback((node: T) => {
    if (ref.current) {
      return
    }

    ref.current = node
    setInitialize(true)
  }, [])

  return [ref, setRef]
}
