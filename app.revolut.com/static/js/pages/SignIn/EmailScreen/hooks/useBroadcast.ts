import { useEffect, useCallback } from 'react'

import { PhoneNumberValue } from '@revolut/rwa-core-types'

import {
  Broadcast,
  BroadcastChannelName,
  BroadcastMessageData,
  BroadcastMessageType,
} from 'utils'

const BROADCAST = new Broadcast(BroadcastChannelName.ConfirmEmail)

export const useBroadcast = (phoneNumber: PhoneNumberValue) => {
  const handleVerifyMessage = useCallback(
    (message: MessageEvent) => {
      const data = message.data as BroadcastMessageData

      if (data.type !== BroadcastMessageType.ConfirmEmailDataRequest) {
        return
      }

      BROADCAST.postMessage({
        type: BroadcastMessageType.ConfirmEmailDataResponse,
        payload: {
          phoneNumber,
        },
      })
    },
    [phoneNumber],
  )

  useEffect(() => {
    BROADCAST.addEventListener(handleVerifyMessage)

    return () => {
      BROADCAST.removeEventListener(handleVerifyMessage)
    }
  }, [handleVerifyMessage])
}
