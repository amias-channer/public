import addMinutes from 'date-fns/addMinutes'
import * as Sentry from '@sentry/react'

import { AxiosCommonHeader } from '../axios'
import { HttpHeader } from '../constants'
import { queryCache } from '../network'
import {
  DefaultStorageKey,
  SecureStorageKey,
  defaultStorage,
  secureStorage,
} from '../storage'
import { encodeAccessToken } from './utils'

// Please see (current config value is 30 minutes):
// https://bitbucket.org/revolut/infra-apps/src/e68c398e4a17daee86f02e3fb4bca67f662063f7/revolut-prod-apps/group_vars/services/config-maps/revolut-domain.yml?at=master#lines-392
export const FALLBACK_ACCESS_TOKENS_EXPIRY_MINUTES = 15

export class AxiosSecurity {
  /**
   * @deprecated
   */
  static saveUsernameAndPasswordToStorage(
    username: string,
    password: string,
    tokenExpiryDate?: number,
  ) {
    secureStorage.setItem(SecureStorageKey.AuthUsername, username)
    secureStorage.setItem(SecureStorageKey.AuthPassword, password)

    if (tokenExpiryDate) {
      const now = Date.now()

      // User's time settings are wrong (token is expired once log in is finished)
      // Example: https://revolut.atlassian.net/browse/BUGS-106828
      if (tokenExpiryDate < now) {
        tokenExpiryDate = addMinutes(now, FALLBACK_ACCESS_TOKENS_EXPIRY_MINUTES).getTime()
      }

      secureStorage.setItem(SecureStorageKey.AuthTokenExpiryDate, tokenExpiryDate)
    }
  }

  /**
   * @deprecated
   */
  static updateApiAuthHeaderFromToken(token: string) {
    AxiosCommonHeader.set(HttpHeader.ApiAuthorization, `Basic ${token}`)
  }

  /**
   * @deprecated
   */
  static updateApiAuthHeaderFromUsernameAndPassword(username: string, password: string) {
    AxiosSecurity.updateApiAuthHeaderFromToken(encodeAccessToken(username, password))
  }

  /**
   * @deprecated
   */
  static updateApiAuthHeaderFromStorage() {
    const username = secureStorage.getItem(SecureStorageKey.AuthUsername)
    const password = secureStorage.getItem(SecureStorageKey.AuthPassword)

    if (username && password) {
      AxiosSecurity.updateApiAuthHeaderFromUsernameAndPassword(username, password)
      Sentry.setUser({
        id: username,
      })
    } else {
      AxiosCommonHeader.remove(HttpHeader.ApiAuthorization)
      Sentry.setUser(null)
    }
  }

  static updateDeviceIdHeaderFromStorage() {
    const deviceId = defaultStorage.getItem(DefaultStorageKey.DeviceId)

    if (deviceId) {
      AxiosCommonHeader.set(HttpHeader.DeviceId, deviceId)
    } else {
      AxiosCommonHeader.remove(HttpHeader.DeviceId)
    }
  }

  /**
   * @deprecated
   */
  static hasAuth() {
    return Boolean(AxiosCommonHeader.get(HttpHeader.ApiAuthorization))
  }

  static signOut() {
    queryCache.clear()
    secureStorage.clear({
      exclude: [SecureStorageKey.RedirectTo],
    })

    AxiosSecurity.updateApiAuthHeaderFromStorage()
  }
}
