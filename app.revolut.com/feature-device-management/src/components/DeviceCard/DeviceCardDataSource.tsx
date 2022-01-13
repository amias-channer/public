import { useCallback, VFC } from 'react'

import { useHistory, useParams, Route } from 'react-router-dom'
import { captureException } from '@sentry/react'
import { useTranslation } from 'react-i18next'

import { UUID } from '@revolut/rwa-core-types'

import { Url } from '../../consts'
import { useDevices, usePopup } from '../../hooks'
import { getDeviceTitle, I18nNamespace } from '../../utils'
import { LogoutPopup } from '../LogoutPopup'
import { DeviceCardView } from './DeviceCardView'

const DeviceCardDataSource: VFC = () => {
  const history = useHistory()
  const devices = useDevices()
  const { deviceId } = useParams<{ deviceId: UUID }>()
  const { t } = useTranslation(`${I18nNamespace.DEVICE_MANAGEMENT}.components`)

  const device = devices.find((item) => item.id === deviceId)
  if (!device) {
    const err = new Error(`There are no device with such id: ${deviceId}`)
    captureException(err)
    throw err
  }

  const deviceTitle =
    getDeviceTitle({
      type: device?.type,
      browserModel: device?.browserModel,
      model: device?.model,
    }) ?? (t('common.device') as string)

  const { setPopup } = usePopup()
  const handleLogout = useCallback(
    () =>
      setPopup(
        <LogoutPopup
          isCurrent={device?.isCurrent === true}
          deviceTitle={deviceTitle}
          deviceId={deviceId}
        />,
      ),
    [setPopup, deviceTitle, deviceId, device],
  )

  return <DeviceCardView {...device} onBack={history.goBack} onLogout={handleLogout} />
}

export const DeviceCardRouter: VFC = () => (
  <Route exact path={Url.DeviceCard} component={DeviceCardDataSource} />
)
