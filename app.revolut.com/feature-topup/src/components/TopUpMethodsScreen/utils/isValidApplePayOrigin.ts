import { isDevelopmentEnv } from '@revolut/rwa-core-config'
import { browser } from '@revolut/rwa-core-utils'

export const isValidApplePayOrigin = () => {
  const isSecureOrigin = browser.getOrigin().startsWith('https://')

  if (!isSecureOrigin && isDevelopmentEnv()) {
    console.warn(
      'ApplePay is disabled for an insecure origin (HTTP). Please use "yarn start:https" script.',
    )

    return false
  }

  // Please note that "ApplePaySession" methods will also throw an exception
  // in case of insecure environment.
  return true
}
