import { noop } from 'lodash'
import { useEffect, useState, useRef } from 'react'

/**
 * This hook is needed to prevent blinking between loading state and new transaction data
 * if new data has been loaded too fast
 */
export const useDelayedLoadingState = <T>(
  content: T | undefined,
  isLoading: boolean,
  delayTimeout: number = 500,
) => {
  const [currentContent, setCurrentContent] = useState<T>()
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()

  const cleanTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = undefined
    }
  }

  useEffect(() => {
    if (currentContent && isLoading && !timeoutRef.current) {
      timeoutRef.current = setTimeout(() => setCurrentContent(undefined), delayTimeout)
      return () => {
        cleanTimer()
      }
    }

    if (!isLoading) {
      if (content) {
        setCurrentContent(content)
      }
      cleanTimer()
    }
    return noop
  }, [content, currentContent, delayTimeout, isLoading])

  return currentContent
}
