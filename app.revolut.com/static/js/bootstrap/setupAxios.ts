import axios, { AxiosError } from 'axios'
import { encodeDeviceId, isEncodeDeviceIdSupported } from 'revolut-web-commons'
import * as Sentry from '@sentry/react'

import { SignOutCause, signOutWithRedirect } from '@revolut/rwa-core-auth'
import { ConfigKey, getConfigValue, isProductionEnv } from '@revolut/rwa-core-config'
import {
  AxiosCommonHeader,
  AxiosSecurity,
  buildSentryContext,
  checkRequired,
  cookieStorage,
  defaultStorage,
  DefaultStorageKey,
  HttpCode,
  HttpHeader,
  RwaNginxCookieName,
  SentryTag,
} from '@revolut/rwa-core-utils'

const setupGeoLocationHeader = () => {
  const latitude = cookieStorage.getItem(RwaNginxCookieName.GeoLatitude)
  const longitude = cookieStorage.getItem(RwaNginxCookieName.GeoLongitude)

  if (latitude && longitude) {
    AxiosCommonHeader.set(HttpHeader.ClientGeoLocation, `${latitude},${longitude}`)
  }
}

const setupDeviceIdHeader = () => {
  if (isProductionEnv() || !isEncodeDeviceIdSupported()) {
    AxiosSecurity.updateDeviceIdHeaderFromStorage()

    return
  }

  const deviceId = checkRequired(
    defaultStorage.getItem(DefaultStorageKey.DeviceId),
    '"deviceId" can not be empty',
  )

  axios.interceptors.request.use((request) => {
    // "deviceId" header should be set by this interceptor by default.
    // The only case where app is not overwritting the header is Chat API
    // (it uses it's own device id value).
    if (!request.headers?.[HttpHeader.DeviceId]) {
      request.headers = {
        ...request.headers,
        [HttpHeader.DeviceId]: encodeDeviceId({
          deviceIdVersion: getConfigValue(ConfigKey.DeviceIdVersion),
          deviceId,
        }) as string,
      }
    }

    return request
  })
}

const setupErrorHandler = () => {
  axios.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      const errorStatus = error.response?.status

      if (
        errorStatus === HttpCode.Unauthorized &&
        getConfigValue<boolean>(ConfigKey.SignOutOnUnauthorizedError)
      ) {
        signOutWithRedirect(SignOutCause.UnauthorizedError)

        // Do not trigger an error
        return undefined
      }

      Sentry.captureException(error, {
        tags: {
          [SentryTag.Context]: buildSentryContext(['axios', 'global error handler']),
        },
      })

      return Promise.reject(error)
    },
  )
}

export const setupAxios = () => {
  axios.defaults.baseURL = getConfigValue(ConfigKey.RevolutApi)

  AxiosCommonHeader.set(
    HttpHeader.BrowserApplication,
    getConfigValue(ConfigKey.BrowserApplication),
  )
  AxiosCommonHeader.set(HttpHeader.ClientVersion, getConfigValue(ConfigKey.ClientVersion))

  setupGeoLocationHeader()
  setupDeviceIdHeader()
  setupErrorHandler()

  AxiosSecurity.updateApiAuthHeaderFromStorage()
}
