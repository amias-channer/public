import { TransactionDto, TransactionType } from '@revolut/rwa-core-types'

export const checkHasSendAgainAction = (transaction: TransactionDto) => {
  const isRecurring = Boolean(transaction.standingOrder?.period)
  const isBankTransfer = transaction.type === TransactionType.Transfer

  return !isRecurring && isBankTransfer && Boolean(transaction.beneficiary)
}
