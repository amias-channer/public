import { TransactionDto, TransactionState } from '@revolut/rwa-core-types'

export const checkIsTransactionFailed = (transaction: TransactionDto) =>
  [
    TransactionState.Declined,
    TransactionState.Failed,
    TransactionState.Cancelled,
  ].includes(transaction.state)
