import { TFunction } from 'i18next'
import { Color } from '@revolut/ui-kit'

import {
  SOWReviewStateType,
  SOTReviewStateType,
  SOWLatestSubmissionStateEnum,
  SOTLatestSubmissionStateEnum,
} from '../../../types'
import { ProgressStep, ProgressStepValue } from '../constants'

export const getProgress = (
  state?: SOWLatestSubmissionStateEnum | SOTLatestSubmissionStateEnum,
  type?: SOWReviewStateType | SOTReviewStateType,
) => {
  const isPendingApproval =
    state === SOWLatestSubmissionStateEnum.PENDING_APPROVAL ||
    state === SOTLatestSubmissionStateEnum.PENDING_APPROVAL

  switch (type) {
    case SOWReviewStateType.UpdateRequired:
    case SOTReviewStateType.UpdateRequired:
      return {
        step: ProgressStep.InReview,
        doneSteps: [ProgressStep.Submited, ProgressStep.InReview],
        progress: ProgressStepValue.InReview,
        color: Color.PINK,
      }
    case SOWReviewStateType.UnderReview:
    case SOTReviewStateType.UnderReview:
      return {
        step: ProgressStep.InReview,
        doneSteps: [ProgressStep.Submited, ProgressStep.InReview],
        progress: ProgressStepValue.InReview,
      }
    case SOWReviewStateType.Rejected:
    case SOTReviewStateType.Rejected:
      return {
        step: ProgressStep.InReview,
        doneSteps: [ProgressStep.Submited, ProgressStep.InReview, ProgressStep.Verified],
        color: Color.RED,
        progress: ProgressStepValue.Verified,
      }
    case SOWReviewStateType.Approved:
    case SOTReviewStateType.Approved:
      return {
        step: ProgressStep.Verified,
        doneSteps: [ProgressStep.Submited, ProgressStep.InReview, ProgressStep.Verified],
        progress: ProgressStepValue.Verified,
      }
    case SOWReviewStateType.Uploaded:
    case SOTReviewStateType.Uploaded:
    default:
      if (isPendingApproval) {
        return {
          step: ProgressStep.Submited,
          doneSteps: [ProgressStep.Submited],
          progress: ProgressStepValue.Submited,
        }
      }

      return {}
  }
}

export const getSteps = (
  t: TFunction,
  dates: {
    submittedDate?: number
    reviewStartedDate?: number
    approvedDate?: number
  },
) => ({
  [ProgressStep.Submited]: {
    title: t('state.submitted'),
    date: dates.submittedDate,
  },
  [ProgressStep.InReview]: {
    title: t('state.in_review'),
    date: dates.reviewStartedDate,
  },
  [ProgressStep.Verified]: {
    title: t('state.verified'),
    date: dates.approvedDate,
  },
})
