import * as Yup from 'yup'
import { Present as PresentIcon } from '@revolut/icons'

import { REWARD_CATEGORY_ICON } from './constants'

export const getRewardCategoryIcon = (categoryId?: string) => {
  if (!categoryId) {
    return PresentIcon
  }
  return REWARD_CATEGORY_ICON[categoryId] || PresentIcon
}

export const rewardFeedbackCommentValidationSchema = Yup.string().required()
