import first from 'lodash/first'
import isEqual from 'lodash/isEqual'

import { TransactionTrackingStageData } from '../../types'
import { getDateFromStage, formatTime } from '../../utils'
import { TrackingStageViewData } from '../types'
import { replaceDatesAfterStageWith } from './replaceDatesAfterStageWith'

export const showOnlyFirstStageDateWhenAllDatesTheSame = (
  firstStage: TransactionTrackingStageData | undefined,
  trackingViewData: TrackingStageViewData[],
) => {
  const firstViewData = first(trackingViewData)?.date
  const isAllDatesTheSame = trackingViewData.every((viewData) =>
    isEqual(viewData.date, firstViewData),
  )

  if (firstStage && firstViewData && isAllDatesTheSame) {
    const stageDate = getDateFromStage(firstStage, false)
    const newFormattedDate = stageDate ? formatTime(new Date(stageDate)) : undefined

    return replaceDatesAfterStageWith({
      trackingViewData,
      stageIndex: 0,
      newDate: newFormattedDate
        ? {
            value: newFormattedDate,
            isEstimated: false,
          }
        : undefined,
      isInclusive: false,
    })
  }

  return trackingViewData
}
