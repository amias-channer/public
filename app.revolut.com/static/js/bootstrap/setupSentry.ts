import { Dedupe, ExtraErrorData } from '@sentry/integrations'
import * as Sentry from '@sentry/react'

import { ConfigKey, getConfigValue, getEnvByOrigin } from '@revolut/rwa-core-config'
import { defaultStorage, DefaultStorageKey, SentryTag } from '@revolut/rwa-core-utils'

const UNKNOWN_DEVICE_ID = 'unknown'

export const setupSentry = () => {
  Sentry.init({
    dsn: getConfigValue(ConfigKey.SentryDsn),
    release: process.env.REACT_APP_RELEASE_TAG,
    environment: getEnvByOrigin(),
    integrations: [new Dedupe(), new ExtraErrorData({ depth: 6 })],
    ignoreErrors: [
      "NotFoundError: Failed to execute 'removeChild' on 'Node'",
      "SecurityError: Failed to execute 'open' on 'XMLHttpRequest'",
      'a[b].target.className.indexOf is not a function',
      'Non-Error exception captured with keys',
      'NotFoundError: The object can not be found here',
      'ResizeObserver loop',
      'tgetT is not defined',
      '|this|.constructor[Symbol.species] is not a constructor',
      'Request failed with status code 401',
      'Request failed with status code 403',
      'Request failed with status code 404',
      'Request failed with status code 422',
    ],
    denyUrls: ['anonymous', 'chrome-extension://', 'safari-extension://'],
  })

  Sentry.setTags({
    [SentryTag.Source]: 'RWA',
    [SentryTag.DeviceId]:
      defaultStorage.getItem(DefaultStorageKey.DeviceId) ?? UNKNOWN_DEVICE_ID,
  })
}
