import { TrackingStageViewData, TrackingStageViewDataDate } from '../types'

type ReplaceDatesAfterStageWithArgs = {
  trackingViewData: TrackingStageViewData[]
  stageIndex: number
  newDate: TrackingStageViewDataDate | undefined
  isInclusive: boolean
}

export const replaceDatesAfterStageWith = ({
  trackingViewData,
  stageIndex,
  newDate,
  isInclusive,
}: ReplaceDatesAfterStageWithArgs) => {
  return trackingViewData.map((viewData, currentViewDataIndex) => {
    if (
      currentViewDataIndex < stageIndex ||
      (currentViewDataIndex === stageIndex && !isInclusive)
    ) {
      return viewData
    }

    return {
      ...viewData,
      date: newDate,
    }
  })
}
