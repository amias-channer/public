import { VFC } from 'react'
import { useTranslation } from 'react-i18next'

import { Group, Header } from '@revolut/ui-kit'

import { I18nNamespace } from '../../utils'
import { DeviceItem } from '../DeviceItem'
import { DeviceListViewProps } from './types'
import { DeviceListSkeleton } from './DeviceListSkeleton'

export const DeviceListView: VFC<DeviceListViewProps> = ({
  devices,
  onDeviceClick,
  onBack,
}: DeviceListViewProps) => {
  const { t } = useTranslation(`${I18nNamespace.DEVICE_MANAGEMENT}.components`)

  return (
    <>
      <Header variant="item">
        <Header.BackButton onClick={onBack} />
        <Header.Title>{t(`common.device_plural`)}</Header.Title>
      </Header>

      {devices.length === 0 ? (
        <DeviceListSkeleton />
      ) : (
        <Group>
          {devices.map((device) => (
            <DeviceItem
              {...device}
              key={device.id}
              onClick={() => device?.id && onDeviceClick(device.id)}
            />
          ))}
        </Group>
      )}
    </>
  )
}
