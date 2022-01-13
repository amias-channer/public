import { WebDevice } from '@revolut/tracker-schema/src/tracker_web_pb'
import * as Bowser from 'bowser'

export const getDevice = (deviceId: string) => {
  const webDevice = new WebDevice()
  const browserInfo = Bowser.parse(window.navigator.userAgent)

  webDevice.setBrowserName(browserInfo.browser.name || 'unknown')
  webDevice.setBrowserVersion(browserInfo.browser.version || '0')
  webDevice.setOsVersion(browserInfo.os.version || '0')
  webDevice.setOsName(browserInfo.os.name || 'unknown')
  webDevice.setUserAgent(window.navigator.userAgent)
  webDevice.setInstallationId(deviceId)

  return webDevice
}
