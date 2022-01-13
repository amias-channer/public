import {
  TransactionDto,
  TransactionState,
  TransactionType,
} from '@revolut/rwa-core-types'

export const getAmountContributingToRunningBalance = (transaction: TransactionDto) => {
  const { amount, fee } = transaction

  const isTransactionCompleted = transaction.state === TransactionState.Completed
  const isTransactionPending = transaction.state === TransactionState.Pending

  const isNegativeExchangeTransaction =
    transaction.type === TransactionType.Exchange && amount < 0

  const isTransactionOfTypeWithFeeToBeConsidered = [
    TransactionType.CardPayment,
    TransactionType.Transfer,
    TransactionType.Atm,
  ].includes(transaction.type)

  const shouldFeeContributeToRunningBalance =
    isTransactionCompleted ||
    (isTransactionPending &&
      (isTransactionOfTypeWithFeeToBeConsidered || isNegativeExchangeTransaction))

  if (shouldFeeContributeToRunningBalance) {
    return amount - fee
  }

  return 0
}
