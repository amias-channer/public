import { RetailEventOptions, COAWebEvent } from 'aqueduct-web'
import { OBJECT_TYPES } from './objectTypes'

const ACCOUNT_EVENTS = {
  statementDownloaded: {
    category: COAWebEvent.Category.Account,
    action: COAWebEvent.Action.completed,
    object: 'Statement',
    description:
      'Track successful statement downloads e.g. when the user clicks Download on the statement',
    objectType: OBJECT_TYPES.DATA,
  },
  statementGenerationfailed: {
    category: COAWebEvent.Category.Account,
    action: COAWebEvent.Action.failed,
    object: 'Statement',
    description:
      'Track failed statement generation errors e.g. when statement generation fails',
    objectType: OBJECT_TYPES.DATA,
  },
}

export const AccountTrackingEvent: Record<
  keyof typeof ACCOUNT_EVENTS,
  RetailEventOptions<string>
> = ACCOUNT_EVENTS
