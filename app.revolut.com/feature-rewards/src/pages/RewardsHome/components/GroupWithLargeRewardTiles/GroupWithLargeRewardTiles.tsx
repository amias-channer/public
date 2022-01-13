import { FC, useRef } from 'react'

import {
  RewardsListTrackingEvent,
  useTrackEventWhenElementIsVisible,
} from '@revolut/rwa-core-analytics'
import { getRewardsGroupUrl, getRewardUrl } from '@revolut/rwa-core-utils'

import {
  RewardsHorizontalTiles,
  RewardTile,
  RewardTileVariant,
} from '../../../../components'
import { GroupWithRewardsDto } from '../../../../types'

type Props = {
  groupWithRewards: GroupWithRewardsDto
  isLast: boolean
}

export const GroupWithLargeRewardTiles: FC<Props> = ({ groupWithRewards, isLast }) => {
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
      ref={groupRef}
      title={groupWithRewards.name}
      groupUrl={getRewardsGroupUrl(groupWithRewards.id)}
      tilesVariant={RewardTileVariant.Regular}
      trackLastItemVisibility
    >
      {groupWithRewards.rewardsData.map((reward) => (
        <RewardTile
          key={reward.id}
          linkUrl={getRewardUrl(reward.id)}
          backgroundImgSrc={reward.description.picture}
          logoImgSrc={reward.merchant.logo}
          title={reward.description.normal}
          likes={reward.social_proof?.likes}
          categoryId={reward.primaryCategoryId}
          merchantName={reward.merchant.name}
        />
      ))}
    </RewardsHorizontalTiles>
  )
}
