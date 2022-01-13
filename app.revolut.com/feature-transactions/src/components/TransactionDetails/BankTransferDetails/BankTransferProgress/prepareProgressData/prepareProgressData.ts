import first from 'lodash/first'

import {
  TransactionRefundDto,
  TransactionTrackingStageStatus,
} from '@revolut/rwa-core-types'

import { SuspiciousPaymentTrackingStatus, TransactionTrackingStageData } from '../types'
import { STAGE_MAPPER } from './trackingStage'
import {
  hideDateForFirstLateDatePendingStage,
  hideDatesAfterFirstErrorStage,
  showOnlyFirstStageDateWhenAllDatesTheSame,
} from './utils'

export const prepareErrorData = (
  tracking: TransactionTrackingStageData[],
  refund?: TransactionRefundDto,
  suspiciousPaymentTrackingStatus?: SuspiciousPaymentTrackingStatus,
) => {
  let isFirstErrorFound = false

  return tracking.map((trackingStage) => {
    const mapper = new STAGE_MAPPER[trackingStage.stage]()

    if (trackingStage.status === TransactionTrackingStageStatus.Failed) {
      if (!isFirstErrorFound) {
        isFirstErrorFound = true

        return mapper.getErrorProgress({
          trackingStage,
          refund,
          suspiciousPaymentTrackingStatus,
        })
      }

      return mapper.getInactive({ trackingStage })
    }

    return mapper.getError({ trackingStage })
  })
}

export const prepareCompletedData = (
  tracking: TransactionTrackingStageData[],
  suspiciousPaymentTrackingStatus?: SuspiciousPaymentTrackingStatus,
) => {
  return tracking.map((trackingStage) => {
    const mapper = new STAGE_MAPPER[trackingStage.stage]()

    return mapper.getCompleted({ trackingStage, suspiciousPaymentTrackingStatus })
  })
}

export const preparePendingData = (
  tracking: TransactionTrackingStageData[],
  suspiciousPaymentTrackingStatus?: SuspiciousPaymentTrackingStatus,
) => {
  let isFirstPendingFound = false

  return tracking.map((trackingStage, stageIndex) => {
    const mapper = new STAGE_MAPPER[trackingStage.stage]()

    if (
      trackingStage.status === TransactionTrackingStageStatus.Pending ||
      suspiciousPaymentTrackingStatus === SuspiciousPaymentTrackingStatus.Pending
    ) {
      if (!isFirstPendingFound) {
        isFirstPendingFound = true

        const previousTrackingStage =
          stageIndex > 0 ? tracking[stageIndex - 1] : undefined

        return mapper.getActiveProgress({
          trackingStage,
          previousTrackingStage,
          suspiciousPaymentTrackingStatus,
        })
      }

      return mapper.getInactive({ trackingStage })
    }

    return mapper.getActiveFinished({ trackingStage, suspiciousPaymentTrackingStatus })
  })
}

/**
 * https://bitbucket.org/revolut/revolut-android/src/development/app_retail/feature_payments_bank_transfer_impl/src/main/kotlin/com/revolut/retail/feature/payments/bank_transfer/impl/transfertracker/
 */
export const prepareProgressData = (
  tracking: TransactionTrackingStageData[],
  refund?: TransactionRefundDto,
  suspiciousPaymentTrackingStatus?: SuspiciousPaymentTrackingStatus,
) => {
  const completedStagesCount = tracking.filter(
    ({ status }) => status === TransactionTrackingStageStatus.Completed,
  ).length
  const hasFailedStages = tracking.some(
    ({ status }) => status === TransactionTrackingStageStatus.Failed,
  )

  if (hasFailedStages) {
    return hideDatesAfterFirstErrorStage(
      tracking,
      prepareErrorData(tracking, refund, suspiciousPaymentTrackingStatus),
    )
  }

  if (completedStagesCount === tracking.length) {
    return showOnlyFirstStageDateWhenAllDatesTheSame(
      first(tracking),
      prepareCompletedData(tracking, suspiciousPaymentTrackingStatus),
    )
  }

  return hideDateForFirstLateDatePendingStage(
    tracking,
    preparePendingData(tracking, suspiciousPaymentTrackingStatus),
  )
}
