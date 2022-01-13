import { TransactionTrackingStageStatus } from '@revolut/rwa-core-types'

import { TransactionTrackingStageData } from '../../types'
import { TrackingStageViewData, TrackingStageViewDataDate } from '../types'
import { replaceDatesAfterStageWith } from './replaceDatesAfterStageWith'

export const EMPTY_DATE: TrackingStageViewDataDate = {
  value: '',
  isEstimated: false,
}

export const hideDatesAfterFirstErrorStage = (
  tracking: TransactionTrackingStageData[],
  trackingViewData: TrackingStageViewData[],
) => {
  const firstErrorStageIndex = tracking.findIndex(
    (stage) => stage.status === TransactionTrackingStageStatus.Failed,
  )

  if (firstErrorStageIndex < 0) {
    return trackingViewData
  }

  return replaceDatesAfterStageWith({
    trackingViewData,
    stageIndex: firstErrorStageIndex,
    newDate: EMPTY_DATE,
    isInclusive: false,
  })
}
