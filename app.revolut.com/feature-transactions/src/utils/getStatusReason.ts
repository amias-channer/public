import { FraudState, TransactionDto, TransactionType } from '@revolut/rwa-core-types'
import { localization } from '@revolut/rwa-core-utils'

import * as transactionPropertyChecker from './transactionPropertyChecker'

export const getStatusReason = (transaction: TransactionDto) => {
  if (
    !transactionPropertyChecker.isDeclinedOrFailed(transaction) &&
    transactionPropertyChecker.tfl(transaction)
  ) {
    return localization.getString('transaction-status-tfl-pending')
  }

  if (
    transactionPropertyChecker.isDeclinedOrFailed(transaction) &&
    transaction.type === TransactionType.Transfer &&
    !transactionPropertyChecker.isTransferToBank(transaction)
  ) {
    return localization.getString('transaction-status-rejected')
  }

  if (transactionPropertyChecker.isDeclinedOrFailed(transaction)) {
    let reason

    if (transaction.fraudState === FraudState.Fraudulent) {
      reason = localization.getString('transaction-reason-fraudulent')
    }

    if (transaction.reason) {
      if (
        transaction.type === TransactionType.Topup ||
        transaction.type === TransactionType.TopupChargeback ||
        transaction.type === TransactionType.TopupReturn
      ) {
        reason = localization.getString(`topup-decline_reason-${transaction.reason}`)
      } else {
        reason = localization.getString(`transaction-reason-${transaction.reason}`)
      }
    }

    if (reason) {
      return reason
    }
  }

  return null
}
