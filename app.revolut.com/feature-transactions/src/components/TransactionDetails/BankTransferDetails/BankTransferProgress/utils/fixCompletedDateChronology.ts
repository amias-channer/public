import isBefore from 'date-fns/isBefore'

import { TransactionTrackingStageData } from '../types'
import { getEstimatedCompletionDateAndTime } from './getEstimatedCompletionDateAndTime'

const ISO_TIMEZONE_SYMBOL = 'Z'
const ISO_TIME_SYMBOL = 'T'

const getAvailableDateFromStage = (stage: TransactionTrackingStageData) => {
  const estDateAndTime = stage.estimatedCompletion
    ? getEstimatedCompletionDateAndTime(stage.estimatedCompletion)
    : undefined

  return stage.completedDate ?? estDateAndTime
}

export const getISODateAndTime = (date: number) => {
  const parts = new Date(date)
    .toISOString()
    .replace(new RegExp(`\\.[0-9]+${ISO_TIMEZONE_SYMBOL}$`), '')
    .split(ISO_TIME_SYMBOL)

  return { date: parts[0], time: parts[1] }
}

const copyStageWithDates = (
  stage: TransactionTrackingStageData,
  completedDate: number | undefined,
  estimatedCompletionDate: number | undefined,
): TransactionTrackingStageData => {
  if (!completedDate && !estimatedCompletionDate) {
    return stage
  }

  const newCompletedDate = completedDate ?? stage.completedDate

  return {
    ...stage,
    completedDate: newCompletedDate,
    estimatedCompletion: estimatedCompletionDate
      ? getISODateAndTime(estimatedCompletionDate)
      : stage.estimatedCompletion,
  }
}

export const fixCompletedDateChronology = (tracking: TransactionTrackingStageData[]) => {
  let previousLatestDate: number | undefined

  return tracking.map((stage) => {
    const previousLatestDateCaptured = previousLatestDate

    if (!previousLatestDateCaptured) {
      previousLatestDate = getAvailableDateFromStage(stage)

      return stage
    }

    const newCompletedDate =
      stage.completedDate && isBefore(stage.completedDate, previousLatestDateCaptured)
        ? previousLatestDateCaptured
        : undefined
    const estimatedDateWithTime =
      stage.estimatedCompletion &&
      getEstimatedCompletionDateAndTime(stage.estimatedCompletion)
    const newEstimatedDateTime =
      estimatedDateWithTime && isBefore(estimatedDateWithTime, previousLatestDateCaptured)
        ? previousLatestDateCaptured
        : undefined

    const stageWithNewDates = copyStageWithDates(
      stage,
      newCompletedDate,
      newEstimatedDateTime,
    )

    previousLatestDate =
      getAvailableDateFromStage(stageWithNewDates) ?? previousLatestDateCaptured

    return stageWithNewDates
  })
}
