import differenceInYears from 'date-fns/differenceInYears'
import isToday from 'date-fns/isToday'

import { TransactionTrackingStageStatus } from '@revolut/rwa-core-types'
import { getFormattedDate, DateFormat } from '@revolut/rwa-core-utils'

import { TransactionTrackingStageData } from '../types'
import { getDateFromStage } from './getDateFromStage'

export const EMPTY_DATE_PLACEHOLDER = '—'

const checkIsMoreThanYearAgo = (date: Date) => differenceInYears(new Date(), date) >= 1

export const formatTime = (date: Date) =>
  getFormattedDate(date, DateFormat.TransactionsBankTransferProgressTime, false)

/**
 * Time is only shown for non PENDING statuses
 */
const formatDate = (date: Date, isEstimated: boolean) => {
  const isRelativeFormatting = isToday(date)

  let formattedDate: string | undefined

  if (!isEstimated && !checkIsMoreThanYearAgo(date)) {
    // Format:
    // - "Today"
    // - "Jun 12 17:47"
    formattedDate = getFormattedDate(
      date,
      DateFormat.TransactionsBankTransferProgressDateShortAndTime,
      isRelativeFormatting,
    )

    if (isRelativeFormatting) {
      // Format:
      // - "Today 17:47"
      formattedDate = `${formattedDate} ${formatTime(date)}`
    }
  } else if (checkIsMoreThanYearAgo(date)) {
    // Format:
    // - "Jun 30 2009"
    formattedDate = getFormattedDate(
      date,
      DateFormat.TransactionsBankTransferProgressDateLong,
      isRelativeFormatting,
    )
  } else {
    // Format:
    // - "Today"
    // - "Jun 12" format
    formattedDate = getFormattedDate(
      date,
      DateFormat.TransactionsBankTransferProgressDateShort,
      isRelativeFormatting,
    )
  }

  return formattedDate
}

/**
 * Please see
 * revolut-android/app_retail/feature_payments_bank_transfer_impl/src/main/kotlin/com/revolut/retail/feature/payments/bank_transfer/impl/transfertracker/StepMapper.kt#getFormattedDate
 */
export const getFormattedStageDate = (
  stage: TransactionTrackingStageData,
  useCreatedDateAsFallback: boolean = false,
) => {
  const dateMillis = getDateFromStage(stage, useCreatedDateAsFallback)

  if (!dateMillis) {
    return {
      value: EMPTY_DATE_PLACEHOLDER,
      isEstimated: false,
    }
  }

  const isEstimated = stage.status === TransactionTrackingStageStatus.Pending

  return {
    value: formatDate(new Date(dateMillis), isEstimated),
    isEstimated,
  }
}
