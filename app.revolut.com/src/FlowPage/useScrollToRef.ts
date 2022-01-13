import { useRef, useCallback } from 'react'
import { isMobile } from 'react-device-detect'

export default function useScrollToRef() {
  const ref = useRef<any>(null)

  const scroll = useCallback(() => {
    if (isMobile && ref.current) {
      ref.current.scrollIntoView()
    }
  }, [])

  return { ref, scroll }
}
