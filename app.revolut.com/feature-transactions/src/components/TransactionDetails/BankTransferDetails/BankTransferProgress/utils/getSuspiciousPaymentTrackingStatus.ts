import { TransactionStatusReasonCodes } from '@revolut/rwa-core-types'

import { SuspiciousPaymentTrackingStatus } from '../types'

export const getSuspiciousPaymentTrackingStatus = (
  reason: TransactionStatusReasonCodes | undefined,
): SuspiciousPaymentTrackingStatus | undefined => {
  switch (reason) {
    case TransactionStatusReasonCodes.SuspiciousTransactionUserActionRequired:
      return SuspiciousPaymentTrackingStatus.Pending
    case TransactionStatusReasonCodes.SuspiciousTransactionUserConfirmed:
      return SuspiciousPaymentTrackingStatus.Approved
    case TransactionStatusReasonCodes.SuspiciousTransactionUserDeclined:
      return SuspiciousPaymentTrackingStatus.Declined
    case TransactionStatusReasonCodes.SuspiciousTransactionTimeout:
      return SuspiciousPaymentTrackingStatus.Timeout
    default:
      return undefined
  }
}
