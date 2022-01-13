import { TransactionStatusReasonCodes } from '@revolut/rwa-core-types'

import { SUSPICIOUS_TRANSFER_REASON_LIST } from './consts'

export const isSuspiciousTransfer = (reason?: TransactionStatusReasonCodes) => {
  return Boolean(reason && SUSPICIOUS_TRANSFER_REASON_LIST.includes(reason))
}
