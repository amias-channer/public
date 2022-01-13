import { TFunction } from 'i18next'
import { chain } from '@revolut/ui-kit'

import { TransactionTrackingStageStatus } from '@revolut/rwa-core-types'

import { SuspiciousPaymentTrackingStatus, TransactionTrackingStageData } from '../types'

export const getGroupTitle = (
  tracking: TransactionTrackingStageData[],
  suspiciousPaymentTrackingStatus: SuspiciousPaymentTrackingStatus | undefined,
  t: TFunction,
) => {
  const hasFailedStages = tracking.some(
    ({ status }) => status === TransactionTrackingStageStatus.Failed,
  )

  if (hasFailedStages) {
    if (suspiciousPaymentTrackingStatus === SuspiciousPaymentTrackingStatus.Declined) {
      return t('field.progress.title.declined')
    }

    if (suspiciousPaymentTrackingStatus === SuspiciousPaymentTrackingStatus.Timeout) {
      return t('field.progress.title.cancelled')
    }

    return t('field.progress.title.failed')
  }

  const completedStagesCount = tracking.filter(
    ({ status }) => status === TransactionTrackingStageStatus.Completed,
  ).length

  if (completedStagesCount === tracking.length) {
    return t('field.progress.title.completed')
  }

  const isSuspiciousPending =
    suspiciousPaymentTrackingStatus === SuspiciousPaymentTrackingStatus.Pending

  return chain(
    t('field.progress.title.pending'),
    `${completedStagesCount + (isSuspiciousPending ? 0 : 1)} / ${tracking.length}`,
  )
}
