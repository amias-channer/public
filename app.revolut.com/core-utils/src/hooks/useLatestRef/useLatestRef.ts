import { useRef } from 'react'

/**
 * this hook is useful when you want to override prop which is used later
 * as dependency for effects, so the effect won't be looped or fired on each parent rerender,
 * as ref object is immutable
 */
export function useLatestRef<T>(value: T) {
  const ref = useRef<T>(value)

  ref.current = value

  return ref
}
