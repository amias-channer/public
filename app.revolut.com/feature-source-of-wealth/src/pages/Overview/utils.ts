import { TFunction } from 'react-i18next'

import { I18nNamespace, getSOWAssetsUrl } from '../../utils'
import {
  SOWLatestSubmissionStateEnum,
  SOTReviewStateType,
  SOTLatestSubmissionStateEnum,
  SOWReviewStateType,
} from '../../types'

export const getHeaderInformation = (
  t: TFunction<typeof I18nNamespace.FormsDocumentType>,
  state?: SOWLatestSubmissionStateEnum | SOTLatestSubmissionStateEnum,
  type?: SOWReviewStateType | SOTReviewStateType,
) => {
  const isPendingApproval =
    state === SOWLatestSubmissionStateEnum.PENDING_APPROVAL ||
    state === SOTLatestSubmissionStateEnum.PENDING_APPROVAL

  const isTypeUploaded =
    type === SOWReviewStateType.Uploaded || type === SOTReviewStateType.Uploaded

  if (isPendingApproval && isTypeUploaded) {
    return {
      image: getSOWAssetsUrl('fc_assets_3_2x.png'),
      title: t('submittedTitle'),
      subtitle: t('locked.submitted_title'),
    }
  }

  switch (type) {
    case SOWReviewStateType.UpdateRequired:
    case SOTReviewStateType.UpdateRequired:
      return {
        image: getSOWAssetsUrl('fc_assets_5_2x.png'),
        title: t('actionTitle'),
        subtitle: t('locked.action_title'),
      }
    case SOWReviewStateType.UnderReview:
    case SOTReviewStateType.UnderReview:
      return {
        image: getSOWAssetsUrl('fc_assets_4_2x.png'),
        title: t('underReviewTitle'),
        subtitle: t('locked.under_review_title'),
      }
    case SOWReviewStateType.Uploaded:
    case SOTReviewStateType.Uploaded:
      return {
        image: getSOWAssetsUrl('fc_assets_2_2x.png'),
        title: t('title'),
        subtitle: t('locked.approved_title'),
      }
    case SOWReviewStateType.Approved:
    case SOTReviewStateType.Approved:
    default:
      return {
        image: getSOWAssetsUrl('fc_assets_2_2x.png'),
        title: t('title'),
        subtitle: t('locked.section_title'),
      }
  }
}
