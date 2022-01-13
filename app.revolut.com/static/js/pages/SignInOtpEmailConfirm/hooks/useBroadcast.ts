import { useEffect, useCallback } from 'react'

import { PhoneNumberValue } from '@revolut/rwa-core-types'

import {
  Broadcast,
  BroadcastChannelName,
  BroadcastMessageData,
  BroadcastMessageType,
} from 'utils'

export const MESSAGE_TIMEOUT = 3000
const BROADCAST = new Broadcast(BroadcastChannelName.ConfirmEmail)

type UseBroadcastArgs = {
  onSuccess: (phoneNumber: PhoneNumberValue) => void
  onError: () => void
}

export const useBroadcast = ({ onSuccess, onError }: UseBroadcastArgs) => {
  const handleVerifyMessage = useCallback(
    (message: MessageEvent) => {
      const data = message.data as BroadcastMessageData

      if (data.type !== BroadcastMessageType.ConfirmEmailDataResponse) {
        return
      }

      onSuccess(data.payload.phoneNumber)
    },
    [onSuccess],
  )

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onError()
    }, MESSAGE_TIMEOUT)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [onError])

  useEffect(() => {
    BROADCAST.addEventListener(handleVerifyMessage)
    BROADCAST.postMessage({
      type: BroadcastMessageType.ConfirmEmailDataRequest,
      payload: {},
    })

    return () => {
      BROADCAST.removeEventListener(handleVerifyMessage)
    }
  }, [handleVerifyMessage])
}
