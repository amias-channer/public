import { TransactionTrackingStageData } from '../types'
import { getEstimatedCompletionDateAndTime } from './getEstimatedCompletionDateAndTime'

/**
 * Stage date in time values must be in UTC time zone
 */
export const getDateFromStage = (
  stage: TransactionTrackingStageData,
  useCreatedDateAsFallback: boolean,
) => {
  const estDateAndTime = stage.estimatedCompletion
    ? getEstimatedCompletionDateAndTime(stage.estimatedCompletion)
    : undefined
  const transactionDate = useCreatedDateAsFallback
    ? stage.transactionCreatedDate
    : undefined

  return stage.completedDate ?? estDateAndTime ?? transactionDate
}
