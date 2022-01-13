import { Tracker, RetailEventOptions } from 'aqueduct-web'
import { omitBy, mapValues, isNil } from 'lodash'

type InitAnalyticsOptions = {
  useLogger?: boolean
  isDev?: boolean
  hostUri?: string
}

export const initAnalytics = (
  deviceId: string,
  { hostUri, useLogger = true, isDev = true }: InitAnalyticsOptions = {},
) => {
  Tracker.enable({
    appId: 'RETAIL',
    deviceId,
    withLogger: useLogger,
    isDev,
    hostUri,
  })
}

export const setTrackedUserId = (userId: string) => Tracker.setUserId(userId)

export const removeTrackedUser = () => Tracker.removeUser()

export const trackEvent = (
  event: RetailEventOptions<string>,
  params?: Record<string, number | string | boolean | null | undefined>,
) => {
  const serializedParams = omitBy(
    mapValues(params, (value) => value?.toString()),
    (value) => isNil(value),
  ) as Record<string, string>
  Tracker.sendRetailEvent(event, serializedParams)
}
