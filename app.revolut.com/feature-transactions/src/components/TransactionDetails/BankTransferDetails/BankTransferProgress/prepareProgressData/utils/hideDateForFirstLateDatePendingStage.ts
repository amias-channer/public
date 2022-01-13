import startOfDay from 'date-fns/startOfDay'
import isAfter from 'date-fns/isAfter'

import {
  TransactionTrackingStageName,
  TransactionTrackingStageStatus,
} from '@revolut/rwa-core-types'

import { TransactionTrackingStageData } from '../../types'
import { EMPTY_DATE_PLACEHOLDER, getDateFromStage } from '../../utils'
import { TrackingStageViewData } from '../types'
import { replaceDatesAfterStageWith } from './replaceDatesAfterStageWith'

export const hideDateForFirstLateDatePendingStage = (
  tracking: TransactionTrackingStageData[],
  trackingViewData: TrackingStageViewData[],
) => {
  const lateDateStageIndex = tracking.findIndex((trackingStage) => {
    const stageDate = getDateFromStage(
      trackingStage,
      trackingStage.stage === TransactionTrackingStageName.Verification,
    )
    const stageDateStartOfDay = stageDate ? startOfDay(stageDate) : undefined
    const todayStartOfDay = startOfDay(new Date())

    return (
      trackingStage.status === TransactionTrackingStageStatus.Pending &&
      stageDateStartOfDay &&
      isAfter(todayStartOfDay, stageDateStartOfDay)
    )
  })

  if (lateDateStageIndex < 0) {
    return trackingViewData
  }

  return replaceDatesAfterStageWith({
    trackingViewData,
    stageIndex: lateDateStageIndex,
    newDate: {
      value: EMPTY_DATE_PLACEHOLDER,
      isEstimated: false,
    },
    isInclusive: true,
  })
}
