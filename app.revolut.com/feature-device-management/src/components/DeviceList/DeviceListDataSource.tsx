import { VFC } from 'react'

import { generatePath, useHistory, Route } from 'react-router'

import { Url } from '../../consts'
import { useDevices } from '../../hooks'
import { DeviceListView } from './DeviceListView'

const DeviceListDataSource: VFC = () => {
  const history = useHistory()
  const devices = useDevices()

  return (
    <DeviceListView
      devices={devices}
      onDeviceClick={(deviceId: string) =>
        history.push(generatePath(Url.DeviceCard, { deviceId }))
      }
      onBack={history.goBack}
    />
  )
}

export const DeviceListRouter: VFC = () => (
  <Route exact path={Url.DeviceManagement} component={DeviceListDataSource} />
)
