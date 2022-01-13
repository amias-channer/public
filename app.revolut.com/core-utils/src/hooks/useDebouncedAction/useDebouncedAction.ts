import { useCallback, useRef } from 'react'

const DEFAULT_DELAY = 300

export const useDebouncedAction = () => {
  const timerRef = useRef<number>()

  return useCallback((action: (...args: any) => void, delay: number = DEFAULT_DELAY) => {
    clearTimeout(timerRef.current)
    // FIXME: Rush migration
    // @ts-expect-error
    timerRef.current = setTimeout(action, delay)
  }, [])
}
