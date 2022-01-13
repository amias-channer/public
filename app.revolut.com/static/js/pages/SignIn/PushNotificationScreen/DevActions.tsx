import { FC } from 'react'
import * as Icons from '@revolut/icons'
import { Box, Media, TextButton } from '@revolut/ui-kit'

import { useAuthContext } from '@revolut/rwa-core-auth'
import {
  checkRequired,
  defaultStorage,
  DefaultStorageKey,
  formatPhoneNumber,
  IconSize,
} from '@revolut/rwa-core-utils'

import {
  useConfirmPushNotificationRequest,
  useRejectPushNotificationRequest,
} from './hooks'

type DevActionsProps = {
  isDifferentMethodAvailable?: boolean
  onUseDifferentMethod: VoidFunction
}

export const DevActions: FC<DevActionsProps> = ({
  isDifferentMethodAvailable,
  onUseDifferentMethod,
}) => {
  const { phoneNumber } = useAuthContext()

  const { confirmPushNotificationRequest, isLoading: isConfirmLoading } =
    useConfirmPushNotificationRequest()
  const { rejectPushNotificationRequest, isLoading: isRejectLoading } =
    useRejectPushNotificationRequest()

  const deviceId = checkRequired(
    defaultStorage.getItem(DefaultStorageKey.DeviceId),
    '"deviceId" can not be empty',
  )

  const handleConfirmClick = () =>
    confirmPushNotificationRequest({
      phone: formatPhoneNumber(phoneNumber),
      deviceId,
    })
  const handleRejectClick = () =>
    rejectPushNotificationRequest({
      phone: formatPhoneNumber(phoneNumber),
      deviceId,
    })

  const isLoading = isConfirmLoading || isRejectLoading

  return (
    <Box mt="px16">
      <TextButton variant="success" disabled={isLoading} onClick={handleConfirmClick}>
        <Media alignItems="center">
          <Icons.Check size={IconSize.Small} />
          <Media.Content ml="px8">Confirm</Media.Content>
        </Media>
      </TextButton>

      <TextButton
        ml="px32"
        variant="error"
        disabled={isLoading}
        onClick={handleRejectClick}
      >
        <Media alignItems="center">
          <Icons.Cross size={IconSize.Small} />
          <Media.Content ml="px8">Reject</Media.Content>
        </Media>
      </TextButton>

      {isDifferentMethodAvailable && (
        <TextButton
          ml="px32"
          variant="warning"
          disabled={isLoading}
          onClick={onUseDifferentMethod}
        >
          <Media alignItems="center">
            <Icons.Chat size={IconSize.Small} />
            <Media.Content ml="px8">Use different method</Media.Content>
          </Media>
        </TextButton>
      )}
    </Box>
  )
}
