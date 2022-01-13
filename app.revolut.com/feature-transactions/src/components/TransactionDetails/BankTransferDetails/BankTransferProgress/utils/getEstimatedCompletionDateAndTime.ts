import parseISO from 'date-fns/parseISO'

import { EstimateDto } from '@revolut/rwa-core-types'

const ISO_TIMEZONE_SYMBOL = 'Z'
const ISO_TIME_SYMBOL = 'T'

export const getEstimatedCompletionDateAndTime = (estimatedCompletion: EstimateDto) => {
  const estDate = estimatedCompletion.date
  const estTime = estimatedCompletion.time
    ? `${ISO_TIME_SYMBOL}${estimatedCompletion.time}`
    : ''

  return parseISO(`${estDate}${estTime}${ISO_TIMEZONE_SYMBOL}`).getTime()
}
