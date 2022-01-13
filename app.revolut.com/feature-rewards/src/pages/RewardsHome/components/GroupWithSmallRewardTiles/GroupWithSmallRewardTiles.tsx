import { FC, useRef } from 'react'

import {
  RewardsListTrackingEvent,
  useTrackEventWhenElementIsVisible,
} from '@revolut/rwa-core-analytics'
import { getRewardsGroupUrl, getRewardUrl } from '@revolut/rwa-core-utils'

import { RewardsHorizontalTiles, RewardSmallTile } from '../../../../components'
import { GroupWithRewardsDto } from '../../../../types'

type Props = {
  groupWithRewards: GroupWithRewardsDto
  isLast: boolean
}

export const GroupWithSmallRewardTiles: FC<Props> = ({ groupWithRewards, isLast }) => {
  const groupRef = useRef<HTMLDivElement>(null)

  useTrackEventWhenElementIsVisible(
    groupRef,
    RewardsListTrackingEvent.lastVerticalCategoryViewed,
    {
      verticalCategoryId: groupWithRewards.id,
    },
    isLast,
  )

  return (
    <RewardsHorizontalTiles
      groupId={groupWithRewards.id}
      title={groupWithRewards.name}
      groupUrl={getRewardsGroupUrl(groupWithRewards.id)}
      ref={groupRef}
      trackLastItemVisibility
    >
      {groupWithRewards.rewardsData.map((reward) => (
        <RewardSmallTile
          key={reward.id}
          linkUrl={getRewardUrl(reward.id)}
          backgroundImgSrc={reward.description.picture}
          logoImgSrc={reward.merchant.logo}
          title={reward.merchant.name}
          brief={reward.description.tiny}
          categoryId={reward.primaryCategoryId}
        />
      ))}
    </RewardsHorizontalTiles>
  )
}
