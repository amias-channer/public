import { RetailEventOptions, COAWebEvent } from 'aqueduct-web'

import { OBJECT_TYPES } from './objectTypes'

const COMMON_EVENTS = {
  locationChanged: {
    category: COAWebEvent.Category.General,
    action: COAWebEvent.Action.opened,
    object: 'AppLocation',
    description: 'Track changing location (url)',
    objectType: OBJECT_TYPES.URL,
  },
  errorPageOpened: {
    category: COAWebEvent.Category.General,
    action: COAWebEvent.Action.opened,
    object: 'UnhandledErrorPage',
    description: 'Track that user got to unhandled error page',
    objectType: OBJECT_TYPES.PAGE,
  },
  errorPageCloseButtonClicked: {
    category: COAWebEvent.Category.General,
    action: COAWebEvent.Action.clicked,
    object: 'UnhandledErrorPageCloseButton',
    description:
      'Track that user clicked close button on unhandled error pagev (destination)',
    objectType: OBJECT_TYPES.BUTTON,
  },
  errorPageClosed: {
    category: COAWebEvent.Category.General,
    action: COAWebEvent.Action.closed,
    object: 'UnhandledErrorPage',
    description: 'Track that user has left unhandled error page',
    objectType: OBJECT_TYPES.PAGE,
  },
  logout: {
    category: COAWebEvent.Category.General,
    action: COAWebEvent.Action.succeeded,
    object: 'App',
    description: 'Track user logout',
    objectType: OBJECT_TYPES.DATA,
  },
} as const

export const CommonTrackingEvent: Record<
  keyof typeof COMMON_EVENTS,
  RetailEventOptions<string>
> = COMMON_EVENTS
