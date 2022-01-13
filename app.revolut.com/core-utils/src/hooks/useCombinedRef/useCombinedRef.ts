import { MutableRefObject, Ref, useEffect, useRef } from 'react'

/**
 * Useful when you want to use inner ref in component which has forwarded ref
 * Idea was taken from:
 * @link https://itnext.io/reusing-the-ref-from-forwardref-with-react-hooks-4ce9df693dd
 * @param defaultValue - default value for both refs (local and forwarded)
 * @param forwardedRef - ref which was forwarded with React.forwardRef
 */

export function useCombinedRef<T>(
  defaultValue: any,
  forwardedRef: Ref<T>,
): MutableRefObject<T> {
  const combinedRef = useRef<T>(defaultValue)

  useEffect(() => {
    if (forwardedRef && combinedRef.current) {
      if (typeof forwardedRef === 'function') {
        forwardedRef(combinedRef.current)
      } else {
        ;(forwardedRef as MutableRefObject<T>).current = combinedRef.current
      }
    }
  }, [forwardedRef])

  return combinedRef
}
