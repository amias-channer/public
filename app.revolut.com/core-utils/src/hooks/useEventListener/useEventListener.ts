import { useEffect } from 'react'

export const useEventListener = (
  eventName: string,
  memoizedHandler: (...args: any[]) => any,
) => {
  useEffect(() => {
    window.addEventListener(eventName, memoizedHandler)
    return () => window.removeEventListener(eventName, memoizedHandler)
  }, [eventName, memoizedHandler])
}
