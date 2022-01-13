import { TransactionTrackingStage } from '@revolut/rwa-core-types'

export type TransactionTrackingStageData = TransactionTrackingStage & {
  transactionCreatedDate: number
}

export enum SuspiciousPaymentTrackingStatus {
  Pending = 'PENDING',
  Approved = 'APPROVED',
  Declined = 'DECLINED',
  Timeout = 'TIMEOUT',
}
