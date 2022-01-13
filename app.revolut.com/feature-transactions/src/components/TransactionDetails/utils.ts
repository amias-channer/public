import {
  TransactionDto,
  TransactionType,
  PocketType,
  PocketOrigin,
  StandingOrderType,
} from '@revolut/rwa-core-types'

import { hasErrorStatus } from '../../utils'

const isBillAccountTransfer = (transaction: TransactionDto) =>
  transaction.billMoneyBox &&
  (!transaction.standingOrder ||
    transaction.standingOrder.type === StandingOrderType.BillMoneyBox)

const isBillAccountPayment = (transaction: TransactionDto) =>
  !transaction.vault && !isBillAccountTransfer(transaction)

const isTransactionInternalVaultTransfer = (transaction: TransactionDto) =>
  Boolean(transaction.vault) && !transaction.vault?.earnedInterest

export const checkIsTransferRefundTransaction = (transaction: TransactionDto) =>
  transaction.type === TransactionType.Refund && Boolean(transaction.relatedTransactionId)

export const checkIsNoteChangeAvailable = (transaction: TransactionDto) =>
  checkIsTransferRefundTransaction(transaction) ||
  transaction.type === TransactionType.Exchange

/*
 * Conditions for transaction statement availability were taken from
 * https://bitbucket.org/revolut/revolut-android/src/02d9c528fb590b626e012b78fd72dcfa9bb13711/app_retail/feature_transactions_impl/src/main/kotlin/com/revolut/feature/transactions/impl/ui/transactiondetails/content_provider/CommonTransactionContentMapperImpl.kt#lines-199
 */
export const isStatementAvailable = (
  transaction: TransactionDto,
  pocketOrigin?: PocketOrigin,
) => {
  return (
    !hasErrorStatus(transaction) &&
    !transaction.vault?.expectedArrival &&
    !isTransactionInternalVaultTransfer(transaction) &&
    (transaction.account.type !== PocketType.Savings ||
      isBillAccountPayment(transaction)) &&
    pocketOrigin !== PocketOrigin.External
  )
}
