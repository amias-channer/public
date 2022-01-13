import React, { useEffect } from "react"
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock"

export const useLockBodyScroll = (
  locked: boolean,
  targetElement: React.RefObject<HTMLElement>,
) => {
  const element = targetElement.current

  useEffect(() => {
    if (!element) {
      return
    }

    if (locked) {
      disableBodyScroll(element)
    } else {
      enableBodyScroll(element)
    }
  }, [locked, element])

  // clean up, on un-mount
  useEffect(() => {
    if (!element) {
      return
    }
    return () => {
      enableBodyScroll(element)
    }
  }, [element])
}

export default useLockBodyScroll
