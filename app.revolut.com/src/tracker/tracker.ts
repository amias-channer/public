import { v4 as uuidv4 } from 'uuid'
import { User } from '@revolut/tracker-schema/src/tracker_common_pb'
import { WebTrackerClient } from '@revolut/tracker-schema/src/Tracker_webServiceClientPb'
import {
  COAWebEvent,
  COAWebEventBusiness,
  WebDevice,
} from '@revolut/tracker-schema/src/tracker_web_pb'

import { getDevice } from '../helpers/getDevice'
import { createDeviceId } from '../helpers/createDeviceId'

export type APP_IDS = 'BUSINESS' | 'RETAIL'

type EventOptions<T> = {
  objectType: T
  object: string
  description?: string
}

export type BusinessEventOptions<T> = EventOptions<T> & {
  category: COAWebEventBusiness.Category
  action: COAWebEventBusiness.Action
}

export type RetailEventOptions<T> = EventOptions<T> & {
  category: COAWebEvent.Category
  action: COAWebEvent.Action
}

const AQUEDUCT_HOST_DEV = 'https://aqueduct-dev.revolutlabs.com'
const AQUEDUCT_HOST = 'https://aqueduct.revolutlabs.com'

const getTrackerHost = (hostUri?: string, isDev?: boolean) => {
  if (hostUri) {
    return hostUri
  }

  return isDev ? AQUEDUCT_HOST_DEV : AQUEDUCT_HOST
}

class Tracker {
  private static trackingService: WebTrackerClient | null = null

  private static user: User | null = null

  private static appId: APP_IDS | null = null

  private static lastEventId: string | null = null

  private static device: WebDevice | null = null

  private static isLoggerEnabled: boolean = false

  static enable({
    appId,
    withLogger = false,
    isDev = false,
    deviceId,
    hostUri,
  }: {
    appId: APP_IDS
    withLogger?: boolean
    isDev?: boolean
    deviceId?: string
    hostUri?: string
  }): null | void {
    if (this.trackingService || !appId) {
      return null
    }

    this.trackingService = new WebTrackerClient(
      getTrackerHost(hostUri, isDev),
      null,
      null,
    )
    this.appId = appId
    this.isLoggerEnabled = withLogger

    this.device = getDevice(deviceId || createDeviceId())

    return null
  }

  static disable() {
    this.trackingService = null
    this.user = null
    this.lastEventId = null
    this.device = null
  }

  static setUserId(id: string) {
    this.user = new User()
    this.user.setId(id)
  }

  static removeUser() {
    this.user = null
  }

  /**
   * params must have type Record<string, string> so it can be displayed correctly in metabase
   */
  static sendBusinessEvent<T>(
    options: BusinessEventOptions<T>,
    params: Record<string, string> = {},
  ): null | void {
    if (!this.trackingService || this.appId !== 'BUSINESS') {
      return null
    }

    const event = new COAWebEventBusiness()

    const eventId = uuidv4()
    event.setId(eventId)
    event.setCategory(options.category)
    event.setAction(options.action)
    event.setObject(options.object)

    if (this.device) {
      event.setDevice(this.device)
    }

    if (this.lastEventId) {
      event.setPreviousEventId(this.lastEventId)
    }
    this.lastEventId = eventId

    if (this.user) {
      event.setUser(this.user)
    }

    const eventParams = event.getParamsMap()
    eventParams.set('objectType', options.objectType)

    Object.keys(params).forEach(key => eventParams.set(key, params[key]))

    this.trackingService
      .recordCOAWebEventBusiness(event, {})
      .then(response => {
        if (this.isLoggerEnabled) {
          /* eslint-disable no-console */
          console.groupCollapsed('aqueduct event')
          console.info(response)
          console.table(options)
          console.table(params)
          console.groupEnd()
        }
      })
      .catch(error => {
        console.error(error)
      })

    return null
  }

  /**
   * params must have type Record<string, string> so it can be displayed correctly in metabase
   */
  static sendRetailEvent<T>(
    options: RetailEventOptions<T>,
    params: Record<string, string> = {},
  ): null | void {
    if (!this.trackingService || this.appId !== 'RETAIL') {
      return null
    }

    const event = new COAWebEvent()

    const eventId = uuidv4()
    event.setId(eventId)
    event.setCategory(options.category)
    event.setAction(options.action)
    event.setObject(options.object)

    if (this.device) {
      event.setDevice(this.device)
    }

    if (this.lastEventId) {
      event.setPreviousEventId(this.lastEventId)
    }
    this.lastEventId = eventId

    if (this.user) {
      event.setUser(this.user)
    }

    const eventParams = event.getParamsMap()
    eventParams.set('objectType', options.objectType)

    Object.keys(params).forEach(key => eventParams.set(key, params[key]))

    this.trackingService
      .recordCOAWebEvent(event, {})
      .then(response => {
        if (this.isLoggerEnabled) {
          /* eslint-disable no-console */
          console.groupCollapsed('aqueduct event')
          console.info(response)
          console.table(options)
          console.table(params)
          console.groupEnd()
        }
      })
      .catch(error => {
        console.error(error)
      })

    return null
  }
}

export { Tracker }
