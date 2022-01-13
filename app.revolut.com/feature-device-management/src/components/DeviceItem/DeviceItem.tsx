import { VFC } from 'react'

import isNil from 'lodash/isNil'
import { useTranslation } from 'react-i18next'

import { Check } from '@revolut/icons'
import { getFormattedDate } from '@revolut/rwa-core-utils'
import { Avatar, chain, Item } from '@revolut/ui-kit'

import { I18nNamespace, getDevicePicture, getDeviceTitle } from '../../utils'
import { DeviceItemProps } from './types'
import { DeviceItemTestId } from './consts'

export const DeviceItem: VFC<DeviceItemProps> = ({
  id,
  type,
  browserModel,
  model,
  isCurrent,
  lastUsed,
  address,
  onClick,
}: DeviceItemProps) => {
  const { t } = useTranslation(`${I18nNamespace.DEVICE_MANAGEMENT}.components`)

  return (
    <Item use="button" onClick={onClick}>
      <Item.Avatar>
        <Avatar size={40} image={getDevicePicture(type)}>
          {isCurrent && (
            <Avatar.Badge
              useIcon={Check}
              data-testid={DeviceItemTestId.DeviceItemCurrentBadge}
            />
          )}
        </Avatar>
      </Item.Avatar>
      <Item.Content>
        <Item.Title>{getDeviceTitle({ type, browserModel, model })}</Item.Title>
        <Item.Description>
          {isCurrent
            ? t('common.thisDevice')
            : chain(
                !isNil(lastUsed) && getFormattedDate(new Date(lastUsed)),
                address?.city,
              )}
        </Item.Description>
      </Item.Content>
    </Item>
  )
}
