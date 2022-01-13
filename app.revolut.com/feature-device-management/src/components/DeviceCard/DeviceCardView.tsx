import { VFC } from 'react'

import isNil from 'lodash/isNil'
import { format } from 'date-fns'

import {
  Button,
  DetailsCell,
  Group,
  Header,
  Box,
  textChain,
  Avatar,
} from '@revolut/ui-kit'
import { LogoutDoor, Check } from '@revolut/icons'
import { GoogleMapPointer } from '@revolut/rwa-core-components'
import {
  DateFormat,
  getFormattedDate,
  I18nNamespace as CoreI18nNamespace,
} from '@revolut/rwa-core-utils'
import { useTranslation } from 'react-i18next'

import { getDevicePicture, getDeviceTitle, I18nNamespace } from '../../utils'
import { DeviceBrand, DeviceResponseAddress } from '../../types'
import { DeviceCardViewProps } from './types'

export const DeviceCardView: VFC<DeviceCardViewProps> = (props) => {
  return (
    <>
      <DeviceCardHeader {...props} />
      {getMap(props)}
      <DeviceCardDetails {...props} />
    </>
  )
}

const DeviceCardHeader: VFC<DeviceCardViewProps> = ({
  type,
  browserModel,
  model,
  lastUsed,
  isCurrent,
  onLogout,
  onBack,
}: DeviceCardViewProps) => {
  const { t } = useTranslation(`${I18nNamespace.DEVICE_MANAGEMENT}.components`)

  const { t: commonT } = useTranslation(CoreI18nNamespace.Common)

  return (
    <Header variant="item">
      <Header.BackButton onClick={onBack} />
      <Header.Title>{getDeviceTitle({ type, browserModel, model })}</Header.Title>
      <Header.Description>
        {isCurrent
          ? t('common.thisDevice')
          : !isNil(lastUsed) &&
            textChain(
              String(t(`${I18nNamespace.DEVICE_CARD}.lastActivity`)),
              getDate(lastUsed),
            )}
      </Header.Description>

      <Header.Bar>
        <Button variant="secondary" size="sm" useIcon={LogoutDoor} onClick={onLogout}>
          {commonT('logout')}
        </Button>
      </Header.Bar>
      <Header.Avatar>
        <Avatar size={56} image={getDevicePicture(type)}>
          {isCurrent && <Avatar.Badge useIcon={Check} />}
        </Avatar>
      </Header.Avatar>
    </Header>
  )
}

const getMap = ({ address: addressData }: DeviceCardViewProps) => {
  const center = addressData && getCenter(addressData)
  const address = addressData && getAddress(addressData)

  if (center && address) {
    return <GoogleMapPointer address={address} center={center} />
  }

  return null
}

const DeviceCardDetails: VFC<DeviceCardViewProps> = ({
  createdAt,
  brand,
  osVersion,
  browserModel,
  address,
}: DeviceCardViewProps) => {
  const { t } = useTranslation(`${I18nNamespace.DEVICE_MANAGEMENT}.components`)

  return (
    <Box mt="s-16">
      <Group>
        {!isNil(createdAt) && (
          <DetailsCell>
            <DetailsCell.Title>
              {t(`${I18nNamespace.DEVICE_CARD}.loginDate`)}
            </DetailsCell.Title>
            <DetailsCell.Content>{getDate(createdAt)}</DetailsCell.Content>
          </DetailsCell>
        )}
        {brand && brand !== DeviceBrand.Browser && (
          <DetailsCell>
            <DetailsCell.Title>
              {t(`${I18nNamespace.DEVICE_CARD}.brand`)}
            </DetailsCell.Title>
            <DetailsCell.Content>{brand}</DetailsCell.Content>
          </DetailsCell>
        )}
        {osVersion && (
          <DetailsCell>
            <DetailsCell.Title>
              {t(`${I18nNamespace.DEVICE_CARD}.version`)}
            </DetailsCell.Title>
            <DetailsCell.Content>{osVersion}</DetailsCell.Content>
          </DetailsCell>
        )}
        {browserModel && (
          <DetailsCell>
            <DetailsCell.Title>
              {t(`${I18nNamespace.DEVICE_CARD}.browser`)}
            </DetailsCell.Title>
            <DetailsCell.Content>{browserModel}</DetailsCell.Content>
          </DetailsCell>
        )}
        {address?.ipAddress && (
          <DetailsCell>
            <DetailsCell.Title>IP</DetailsCell.Title>
            <DetailsCell.Content>{address.ipAddress}</DetailsCell.Content>
          </DetailsCell>
        )}
      </Group>
    </Box>
  )
}

const getAddress = ({ city, country }: DeviceResponseAddress) =>
  [city, country].filter(Boolean).join(', ')

const getCenter = ({ lat, lon }: DeviceResponseAddress) => {
  if (!isNil(lat) && !isNil(lon)) {
    return {
      latitude: lat,
      longitude: lon,
    }
  }
  return undefined
}

const getDate = (date: number) => {
  const d = new Date(date)
  return textChain(
    getFormattedDate(d),
    format(d, DateFormat.TransactionsBankTransferProgressTime),
  )
}
