import { TransactionStatusReasonCodes } from '@revolut/rwa-core-types'

export const SUSPICIOUS_TRANSFER_REASON_LIST = [
  TransactionStatusReasonCodes.SuspiciousTransactionTimeout,
  TransactionStatusReasonCodes.SuspiciousTransactionUserActionRequired,
  TransactionStatusReasonCodes.SuspiciousTransactionUserConfirmed,
  TransactionStatusReasonCodes.SuspiciousTransactionUserDeclined,
]
