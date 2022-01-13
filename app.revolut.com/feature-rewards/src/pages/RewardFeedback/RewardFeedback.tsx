import qs from 'qs'
import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, useHistory } from 'react-router-dom'
import { StatusPopup, Button } from '@revolut/ui-kit'

import { browser, getRewardUrl } from '@revolut/rwa-core-utils'

import { useReward } from '../../hooks'
import { CustomFeedbackScreen } from './CustomFeedbackScreen'
import { PredefinedOptionsScreen } from './PredefinedOptionsScreen'

type UrlParams = {
  rewardId: string
}

enum RewardFeedbackPageState {
  PreDefinedOptions = 'PRE_DEFINED',
  CustomOption = 'CUSTOM',
  FeedbackSent = 'FEEDBACK_SENT',
}

export const RewardFeedback: FC = () => {
  const [pageState, setPageState] = useState<RewardFeedbackPageState>(
    RewardFeedbackPageState.PreDefinedOptions,
  )
  const [isOkPopupOpen, setOkPopupOpen] = useState(false)

  const { t } = useTranslation('pages.RewardFeedback')

  const rewardQuery = qs.parse(browser.getSearch())

  const history = useHistory()

  const { rewardId } = useParams<UrlParams>()

  const { dislike } = useReward(rewardId)

  const onPredefinedOptionsBackClick = () => {
    history.push(getRewardUrl(rewardId, rewardQuery))
  }

  const onPopupClose = () => {
    history.push(getRewardUrl(rewardId, rewardQuery))
  }

  const onCustomFeedbackBackClick = () => {
    setPageState(RewardFeedbackPageState.PreDefinedOptions)
  }

  const onOtherOptionClick = () => {
    setPageState(RewardFeedbackPageState.CustomOption)
  }

  const onCommentSubmit = async (comment: string) => {
    await dislike(comment)
    setOkPopupOpen(true)
  }

  const getFeedbackPage = () => {
    switch (pageState) {
      case RewardFeedbackPageState.CustomOption:
        return (
          <CustomFeedbackScreen
            onBackClick={onCustomFeedbackBackClick}
            onCommentSubmit={onCommentSubmit}
          />
        )
      default:
        return (
          <PredefinedOptionsScreen
            onBackClick={onPredefinedOptionsBackClick}
            onOtherOptionClick={onOtherOptionClick}
            onPredefinedOptionSubmit={onCommentSubmit}
          />
        )
    }
  }

  return (
    <>
      {getFeedbackPage()}
      <StatusPopup
        variant="success-optional"
        isOpen={isOkPopupOpen}
        onExit={onPopupClose}
      >
        <StatusPopup.Title>{t('FeedbackSentScreen.title')}</StatusPopup.Title>
        <StatusPopup.Description>
          {t('FeedbackSentScreen.description')}
        </StatusPopup.Description>
        <StatusPopup.Actions>
          <Button elevated>{t('FeedbackSentScreen.done')}</Button>
        </StatusPopup.Actions>
      </StatusPopup>
    </>
  )
}
