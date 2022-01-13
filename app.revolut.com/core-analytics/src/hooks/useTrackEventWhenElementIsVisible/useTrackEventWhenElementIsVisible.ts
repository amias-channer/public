import { RetailEventOptions } from 'aqueduct-web'
import { RefObject, useState, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

import { trackEvent } from '../../trackEvent'

export const useTrackEventWhenElementIsVisible = (
  element: RefObject<HTMLElement | undefined>,
  event: RetailEventOptions<string>,
  eventParams: Record<string, number | string | undefined>,
  enabled: boolean = true,
) => {
  const [isEventSent, setIsEventSent] = useState<boolean>(false)
  const { inView, ref: inViewRef } = useInView({ threshold: 1.0 })

  useEffect(() => {
    if (element) {
      inViewRef(element.current)
    }
  }, [element, inViewRef])

  useEffect(() => {
    if (inView && !isEventSent && enabled) {
      trackEvent(event, eventParams)
      setIsEventSent(true)
    }
  }, [event, eventParams, isEventSent, enabled, inView])
}
