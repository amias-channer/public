import { FC, useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { Header } from '@revolut/ui-kit'

import { getRewardUrl, Url, useNavigateToErrorPage } from '@revolut/rwa-core-utils'

import { RewardsTilesGrid, RewardsLayout } from '../../components'
import { useRewards } from '../../hooks'

const GROUPS_TO_SHOW_ORDER_NUMBER = ['trending']

type UrlParams = {
  rewardsGroupId: string
}

export const RewardsGroup: FC = () => {
  const { rewardsGroupId } = useParams<UrlParams>()
  const history = useHistory()
  const navigateToErrorPage = useNavigateToErrorPage()

  const { isError, isSuccess, getRewardsGroup } = useRewards()

  const getRewardDetailsUrl = (rewardId: string) =>
    getRewardUrl(rewardId, { groupId: rewardsGroupId })

  const onBackClick = () => {
    history.push(Url.RewardsHome)
  }

  const rewardsGroup = getRewardsGroup(rewardsGroupId)

  useEffect(() => {
    if (isError || (isSuccess && !rewardsGroup)) {
      navigateToErrorPage('Rewards fetch failed')
    }
  }, [navigateToErrorPage, isError, isSuccess, rewardsGroup])

  return (
    <RewardsLayout>
      <Header variant="item">
        <Header.BackButton aria-label="Back" onClick={onBackClick} />
        <Header.Title>{rewardsGroup?.name}</Header.Title>
      </Header>
      <RewardsTilesGrid
        showOrderNumbers={GROUPS_TO_SHOW_ORDER_NUMBER.includes(rewardsGroupId)}
        rewards={rewardsGroup?.rewardsData || []}
        getRewardDetailsUrl={getRewardDetailsUrl}
      />
    </RewardsLayout>
  )
}
