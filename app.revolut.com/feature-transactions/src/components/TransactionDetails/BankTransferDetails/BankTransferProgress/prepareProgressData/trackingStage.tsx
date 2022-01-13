import differenceInDays from 'date-fns/differenceInDays'
import parseISO from 'date-fns/parseISO'
import isNil from 'lodash/isNil'
import { Trans } from 'react-i18next'
import { Color, TextButton } from '@revolut/ui-kit'

import {
  TransactionRefundDto,
  TransactionTrackingStageName,
} from '@revolut/rwa-core-types'

import { I18N_NAMESPACE } from '../../../constants'
import { SuspiciousPaymentTrackingStatus, TransactionTrackingStageData } from '../types'
import { getFormattedStageDate, isStageDelayed } from '../utils'
import { TrackingStageViewData } from './types'

const getI18nKey = (key: string) => `${I18N_NAMESPACE}:field.progress.${key}`

type GetErrorProgressArgs = {
  trackingStage: TransactionTrackingStageData
  refund?: TransactionRefundDto
  suspiciousPaymentTrackingStatus?: SuspiciousPaymentTrackingStatus
}

type GetGenericProgressArgs = {
  trackingStage: TransactionTrackingStageData
  previousTrackingStage?: TransactionTrackingStageData
  suspiciousPaymentTrackingStatus?: SuspiciousPaymentTrackingStatus
  color: Color
}

type GetGenericCompletedArgs = {
  trackingStage: TransactionTrackingStageData
  suspiciousPaymentTrackingStatus?: SuspiciousPaymentTrackingStatus
  color?: Color
}

type GetCompletedArgs = Omit<GetGenericCompletedArgs, 'color'>

export abstract class TrackingStage {
  getActiveProgress({
    trackingStage,
    previousTrackingStage,
    suspiciousPaymentTrackingStatus,
  }: Omit<GetGenericProgressArgs, 'color'>) {
    return this.getGenericProgress({
      trackingStage,
      previousTrackingStage,
      suspiciousPaymentTrackingStatus,
      color: Color.PRIMARY,
    })
  }

  getActiveFinished({
    trackingStage,
    suspiciousPaymentTrackingStatus,
  }: GetCompletedArgs) {
    return this.getGenericCompleted({
      trackingStage,
      suspiciousPaymentTrackingStatus,
      color: Color.PRIMARY,
    })
  }

  getInactive({ trackingStage }: Pick<GetGenericCompletedArgs, 'trackingStage'>) {
    return this.getGenericCompleted({
      trackingStage,
    })
  }

  getError({ trackingStage }: Pick<GetGenericCompletedArgs, 'trackingStage'>) {
    return this.getGenericCompleted({
      trackingStage,
      color: Color.ERROR,
    })
  }

  getCompleted({ trackingStage, suspiciousPaymentTrackingStatus }: GetCompletedArgs) {
    return this.getGenericCompleted({
      trackingStage,
      suspiciousPaymentTrackingStatus,
      color: Color.SUCCESS,
    })
  }

  abstract getErrorProgress(args: GetErrorProgressArgs): TrackingStageViewData

  abstract getGenericProgress(args: GetGenericProgressArgs): TrackingStageViewData

  abstract getGenericCompleted(args: GetGenericCompletedArgs): TrackingStageViewData
}

class VerificationTrackingStage extends TrackingStage {
  getErrorProgress({
    trackingStage,
    suspiciousPaymentTrackingStatus,
  }: GetErrorProgressArgs): TrackingStageViewData {
    return {
      key: trackingStage.stage,
      done: true,
      color: Color.ERROR,
      date: getFormattedStageDate(trackingStage, true),

      renderTitle: ({ t }) => {
        if (
          suspiciousPaymentTrackingStatus &&
          [
            SuspiciousPaymentTrackingStatus.Declined,
            SuspiciousPaymentTrackingStatus.Timeout,
          ].includes(suspiciousPaymentTrackingStatus)
        ) {
          return t(getI18nKey('title.declined'))
        }

        return t(getI18nKey('title.failed'))
      },

      renderSubtitle: ({ t }) => {
        if (
          suspiciousPaymentTrackingStatus === SuspiciousPaymentTrackingStatus.Declined
        ) {
          return t(getI18nKey('stage.verification.declinedByUser.subtitle'))
        }

        return t(getI18nKey('subtitle.failed.refunded-no-resend'))
      },
    }
  }

  getGenericProgress({
    trackingStage,
    suspiciousPaymentTrackingStatus,
    color,
  }: GetGenericProgressArgs): TrackingStageViewData {
    return {
      key: trackingStage.stage,
      done: true,
      color: suspiciousPaymentTrackingStatus ? Color.WARNING : color,
      date: getFormattedStageDate(trackingStage, true),

      renderTitle: ({ t }) => {
        return suspiciousPaymentTrackingStatus
          ? t(getI18nKey('stage.verification.userActionRequired.title'))
          : t(getI18nKey('stage.verification.pending.title'))
      },

      renderSubtitle: ({ t }) => {
        return suspiciousPaymentTrackingStatus
          ? t(getI18nKey('stage.verification.userActionRequired.subtitle'))
          : null
      },
    }
  }

  getGenericCompleted({
    trackingStage,
    suspiciousPaymentTrackingStatus,
    color,
  }: GetGenericCompletedArgs): TrackingStageViewData {
    return {
      key: trackingStage.stage,
      done: Boolean(color),
      color,
      date: getFormattedStageDate(trackingStage, true),

      renderTitle: ({ t }) => {
        return suspiciousPaymentTrackingStatus
          ? t(getI18nKey('stage.verification.acceptedByUser.title'))
          : t(getI18nKey('stage.verification.completed.title'))
      },
    }
  }
}

class ProcessingTrackingStage extends TrackingStage {
  getErrorProgress({ trackingStage }: GetErrorProgressArgs): TrackingStageViewData {
    return {
      key: trackingStage.stage,
      done: true,
      color: Color.ERROR,
      date: getFormattedStageDate(trackingStage),

      renderTitle: ({ t }) => t(getI18nKey('title.failed')),

      renderSubtitle: ({ t }) => t(getI18nKey('subtitle.failed.refunded-no-resend')),
    }
  }

  getGenericProgress({
    trackingStage,
    color,
  }: GetGenericProgressArgs): TrackingStageViewData {
    return {
      key: trackingStage.stage,
      done: true,
      color,
      date: getFormattedStageDate(trackingStage),

      renderTitle: ({ t }) => t(getI18nKey('stage.processing.pending.title')),

      renderSubtitle: ({ t }) =>
        isStageDelayed(trackingStage)
          ? t(getI18nKey('stage.processing.subtitle.delayed'))
          : undefined,
    }
  }

  getGenericCompleted({
    trackingStage,
    color,
  }: GetGenericCompletedArgs): TrackingStageViewData {
    return {
      key: trackingStage.stage,
      done: Boolean(color),
      color,
      date: getFormattedStageDate(trackingStage),

      renderTitle: ({ t }) => t(getI18nKey('stage.processing.completed.title')),
    }
  }
}

class DeliveryTrackingStage extends TrackingStage {
  getErrorProgress({
    trackingStage,
    refund,
  }: GetErrorProgressArgs): TrackingStageViewData {
    return {
      key: trackingStage.stage,
      done: true,
      color: Color.ERROR,
      refundNote: refund?.note,
      date: getFormattedStageDate(trackingStage),

      renderTitle: ({ t }) => t(getI18nKey('stage.delivery.failed.title')),

      renderSubtitle: ({ t, onViewRefundAction }) => {
        return refund ? (
          <Trans
            t={t}
            i18nKey={getI18nKey('subtitle.failed.view-refund')}
            components={{
              action: <TextButton variant="primary" onClick={onViewRefundAction} />,
            }}
          />
        ) : (
          t(getI18nKey('stage.delivery.failed.subtitle'))
        )
      },
    }
  }

  getGenericProgress({
    trackingStage,
    color,
  }: GetGenericProgressArgs): TrackingStageViewData {
    return {
      key: trackingStage.stage,
      done: true,
      color,
      date: getFormattedStageDate(trackingStage),

      renderTitle: ({ t }) => t(getI18nKey('stage.delivery.pending.title')),
    }
  }

  getGenericCompleted({
    trackingStage,
    color,
  }: GetGenericCompletedArgs): TrackingStageViewData {
    return {
      key: trackingStage.stage,
      done: Boolean(color),
      color,
      date: getFormattedStageDate(trackingStage),

      renderTitle: ({ t }) => t(getI18nKey('stage.delivery.completed.title')),
    }
  }
}

class CreditTrackingStage extends TrackingStage {
  getErrorProgress({
    trackingStage,
    refund,
  }: GetErrorProgressArgs): TrackingStageViewData {
    return {
      key: trackingStage.stage,
      done: true,
      color: Color.ERROR,
      refundNote: refund?.note,
      date: getFormattedStageDate(trackingStage),

      renderTitle: ({ t }) => t(getI18nKey('stage.credit.failed.title')),

      renderSubtitle: ({ t, onViewRefundAction }) => {
        return refund ? (
          <Trans
            t={t}
            i18nKey={getI18nKey('subtitle.failed.view-refund')}
            components={{
              action: <TextButton variant="primary" onClick={onViewRefundAction} />,
            }}
          />
        ) : (
          t(getI18nKey('stage.credit.failed.subtitle'))
        )
      },
    }
  }

  getGenericProgress({
    trackingStage,
    previousTrackingStage,
    color,
  }: GetGenericProgressArgs): TrackingStageViewData {
    return {
      key: trackingStage.stage,
      done: true,
      color,
      date: getFormattedStageDate(trackingStage),

      renderTitle: ({ t }) => t(getI18nKey('stage.credit.pending.title')),

      renderSubtitle: ({ t }) => {
        const currentStageEstimatedCompletionDate =
          trackingStage.estimatedCompletion?.date
        const previousStageEstimatedCompletionDate =
          previousTrackingStage?.estimatedCompletion?.date

        const daysLeft =
          currentStageEstimatedCompletionDate && previousStageEstimatedCompletionDate
            ? differenceInDays(
                parseISO(currentStageEstimatedCompletionDate),
                parseISO(previousStageEstimatedCompletionDate),
              )
            : undefined

        if (isNil(daysLeft)) {
          return undefined
        }

        return daysLeft > 0
          ? t(getI18nKey('stage.credit.pending.subtitle.delayAnotherDay'), {
              daysLeft,
            })
          : t(getI18nKey('stage.credit.pending.subtitle.delaySameDay'), {
              daysLeft,
            })
      },
    }
  }

  getGenericCompleted({
    trackingStage,
    color,
  }: GetGenericCompletedArgs): TrackingStageViewData {
    return {
      key: trackingStage.stage,
      done: Boolean(color),
      color,
      date: getFormattedStageDate(trackingStage),

      renderTitle: ({ t }) => t(getI18nKey('stage.credit.completed.title.generic')),
    }
  }

  getCompleted({ trackingStage }: GetCompletedArgs): TrackingStageViewData {
    return {
      key: trackingStage.stage,
      done: true,
      color: Color.SUCCESS,
      date: getFormattedStageDate(trackingStage),

      renderTitle: ({ t }) =>
        trackingStage.completedDate
          ? t(getI18nKey('stage.credit.completed.title.confirmed'))
          : t(getI18nKey('stage.credit.completed.title.notConfirmed')),

      renderSubtitle: ({ t }) =>
        trackingStage.completedDate
          ? t(getI18nKey('stage.credit.completed.subtitle.confirmed'))
          : t(getI18nKey('stage.credit.completed.subtitle.notConfirmed')),
    }
  }
}

export const STAGE_MAPPER: Record<TransactionTrackingStageName, new () => TrackingStage> =
  {
    [TransactionTrackingStageName.Verification]: VerificationTrackingStage,
    [TransactionTrackingStageName.Processing]: ProcessingTrackingStage,
    [TransactionTrackingStageName.Delivery]: DeliveryTrackingStage,
    [TransactionTrackingStageName.Credit]: CreditTrackingStage,
  }
