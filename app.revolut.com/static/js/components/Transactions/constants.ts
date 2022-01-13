import { TransactionState } from '@revolut/rwa-core-types'

export const EDGE_OFFSET = 400
export const TRANSACTIONS_INFINITE_SCROLL_BATCH_SIZE = 50
export const CARD_HEIGHT = 96
export const CARD_PADDING = 8

export const failedTransactionStatuses = [
  TransactionState.Failed,
  TransactionState.Declined,
  TransactionState.Cancelled,
  TransactionState.Reverted,
]
