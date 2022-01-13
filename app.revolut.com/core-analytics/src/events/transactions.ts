import { RetailEventOptions, COAWebEvent } from 'aqueduct-web'

import { OBJECT_TYPES } from './objectTypes'

const TRANSACTION_EVENTS = {
  detailsOpened: {
    category: COAWebEvent.Category.TransactionDetails,
    action: COAWebEvent.Action.opened,
    object: 'TransactionDetails',
    objectType: OBJECT_TYPES.PAGE,
    description: 'Track opening transaction details page (transactionId, legId, source)',
  },
  detailsClosed: {
    category: COAWebEvent.Category.TransactionDetails,
    action: COAWebEvent.Action.closed,
    object: 'TransactionDetails',
    objectType: OBJECT_TYPES.PAGE,
    description: 'Track closing transaction details page (transactionId, legId)',
  },
  confirmed: {
    category: COAWebEvent.Category.Transaction,
    action: COAWebEvent.Action.confirmed,
    object: 'SuspiciousTransaction',
    objectType: OBJECT_TYPES.DATA,
    description:
      'Track that suspiciois transaction is confirmed (has been made ) by user (transactionId)',
  },
  declined: {
    category: COAWebEvent.Category.Transaction,
    action: COAWebEvent.Action.declined,
    object: 'SuspiciousTransaction',
    objectType: OBJECT_TYPES.DATA,
    description:
      'Track that suspiciois transaction is declined (has not been made ) by user (transactionId)',
  },
  statementDownloaded: {
    category: COAWebEvent.Category.Transaction,
    action: COAWebEvent.Action.completed,
    object: 'Statement',
    objectType: OBJECT_TYPES.DATA,
    description:
      'Track successful statement downloads e.g. when the user clicks Download on the statement',
  },
  statementGenerationFailed: {
    category: COAWebEvent.Category.Transaction,
    action: COAWebEvent.Action.failed,
    object: 'Statement',
    objectType: OBJECT_TYPES.DATA,
    description:
      'Track failed statement generation errors e.g. when statement generation fails',
  },
} as const

const TRANSACTIONS_LIST_EVENTS: Record<string, RetailEventOptions<string>> = {
  listOpened: {
    category: COAWebEvent.Category.Transaction,
    action: COAWebEvent.Action.opened,
    object: 'TransactionsList',
    objectType: OBJECT_TYPES.PAGE,
    description: 'Track opening transactions list (pocketId)',
  },
  listClosed: {
    category: COAWebEvent.Category.Transaction,
    action: COAWebEvent.Action.closed,
    object: 'TransactionsList',
    objectType: OBJECT_TYPES.PAGE,
    description: 'Track closing transactions list (pocketId)',
  },
  filterSet: {
    category: COAWebEvent.Category.Transaction,
    action: COAWebEvent.Action.filtered,
    object: 'TransactionsList',
    objectType: OBJECT_TYPES.DATA,
    description: 'Track setting of transactions filter (pocketId and filter values)',
  },
} as const

export const TransactionTrackingEvent: Record<
  keyof typeof TRANSACTION_EVENTS,
  RetailEventOptions<string>
> = TRANSACTION_EVENTS

export const TransactionsListTrackingEvent: Record<
  keyof typeof TRANSACTIONS_LIST_EVENTS,
  RetailEventOptions<string>
> = TRANSACTIONS_LIST_EVENTS
