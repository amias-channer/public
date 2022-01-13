import { TransactionState } from '@revolut/rwa-core-types'

export const failedTransactionStatuses = [
  TransactionState.Failed,
  TransactionState.Declined,
  TransactionState.Cancelled,
  TransactionState.Reverted,
]
