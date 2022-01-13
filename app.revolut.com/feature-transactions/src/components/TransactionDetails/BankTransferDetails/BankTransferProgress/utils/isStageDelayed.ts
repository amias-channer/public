import isAfter from 'date-fns/isAfter'
import startOfDay from 'date-fns/startOfDay'

import { TransactionTrackingStageData } from '../types'
import { getEstimatedCompletionDateAndTime } from './getEstimatedCompletionDateAndTime'

export const isStageDelayed = (stage: TransactionTrackingStageData) => {
  if (!stage.estimatedCompletion) {
    return false
  }

  const estDate = getEstimatedCompletionDateAndTime(stage.estimatedCompletion)

  return isAfter(startOfDay(new Date()), startOfDay(estDate))
}
