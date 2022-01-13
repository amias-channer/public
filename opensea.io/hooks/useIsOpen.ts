import { useCallback, useState } from "react"

export const useIsOpen = (initiallyOpen = false) => {
  const [isOpen, setIsOpen] = useState(initiallyOpen)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen(prev => !prev), [])

  return { isOpen, open, close, setIsOpen, toggle }
}

export default useIsOpen
