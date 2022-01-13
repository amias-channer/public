import { noop } from 'lodash'
import qs from 'qs'
import { FC, useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom'

import { trackEvent, RewardTrackingEvent } from '@revolut/rwa-core-analytics'
import {
  browser,
  getRewardsGroupUrl,
  getRewardsHomeUrl,
  useNavigateToErrorPage,
} from '@revolut/rwa-core-utils'

import { RewardsLayout } from '../../components'
import { useReward, useRewards } from '../../hooks'
import { RewardContent } from './RewardContent'

type UrlParams = {
  rewardId: string
}

type UrlQuery = {
  groupId?: string
  search?: string
  categoryId?: string
}

export const RewardDetails: FC = () => {
  const { rewardId } = useParams<UrlParams>()
  const { groupId, categoryId, search } = qs.parse(browser.getSearch()) as UrlQuery
  const history = useHistory()
  const navigateToErrorPage = useNavigateToErrorPage()
  const {
    isSuccess: isRewardsFetched,
    isError: isRewardsFetchFailed,
    getSimilarRewards,
  } = useRewards()

  const { isRewardFetched, isRewardFetchFailed, rewardData: reward } = useReward(rewardId)

  const similarRewards = getSimilarRewards(rewardId)

  const onBackClick = () => {
    if (groupId) {
      history.push(getRewardsGroupUrl(groupId))
      return
    }
    history.push(getRewardsHomeUrl({ categoryId, search }))
  }

  const isError =
    (isRewardFetched && !reward) || isRewardFetchFailed || isRewardsFetchFailed

  useEffect(() => {
    if (isError) {
      navigateToErrorPage('Rewards fetch failed')
    }
  }, [navigateToErrorPage, isError])

  useEffect(() => {
    browser.scrollTo({ top: 0 })
  }, [rewardId])

  useEffect(() => {
    if (!reward) {
      return noop
    }

    trackEvent(RewardTrackingEvent.detailsOpened, {
      perkId: reward.id,
      timeLeft: reward.end ? reward.end - Date.now() : undefined,
      category: reward.primaryCategoryId,
    })

    return () => {
      trackEvent(RewardTrackingEvent.detailsClosed, {
        perkId: reward.id,
        timeLeft: reward.end ? reward.end - Date.now() : undefined,
      })
    }
  }, [reward])

  return (
    <RewardsLayout isLoading={!isRewardsFetched || !isRewardFetched}>
      {reward && (
        <RewardContent
          reward={reward}
          similarRewards={similarRewards}
          onBackClick={onBackClick}
        />
      )}
    </RewardsLayout>
  )
}
