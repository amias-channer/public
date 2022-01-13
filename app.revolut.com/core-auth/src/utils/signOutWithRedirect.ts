import { AxiosSecurity, Url, browser } from '@revolut/rwa-core-utils'
import {
  CommonTrackingEvent,
  trackEvent,
  removeTrackedUser,
} from '@revolut/rwa-core-analytics'

import { signOut } from './signOut'

export enum SignOutCause {
  User = 'USER',
  UnauthorizedError = 'UNAUTHORIZED_ERROR',
  Inactivity = 'INACTIVITY',
  ExpiredToken = 'EXPIRED_TOKEN',
}

export const signOutWithRedirect = (cause: SignOutCause) => {
  const callback = () => {
    AxiosSecurity.signOut()

    trackEvent(CommonTrackingEvent.logout, { cause })
    removeTrackedUser()

    if (cause === SignOutCause.User) {
      browser.navigateTo(Url.Start)
    } else {
      browser.navigateTo(Url.LoggedOut)
    }
  }

  signOut().then(callback).catch(callback)
}
