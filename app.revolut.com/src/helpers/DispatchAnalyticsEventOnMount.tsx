import { useEffect } from 'react'

import { useSendChatEvent } from '../providers'

type Props = {
  event: { type: string }
}

// This is intended to be used with class components, until we completely migrate to hooks/FC.
export const DispatchAnalyticsEventOnMount = ({ event }: Props) => {
  const sendChatEvent = useSendChatEvent()

  useEffect(() => {
    sendChatEvent(event)
  }, [sendChatEvent]) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}
