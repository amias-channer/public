import { last } from 'lodash'
import { FC } from 'react'
import { Box } from '@revolut/ui-kit'

import { getRewardsGroupUrl } from '@revolut/rwa-core-utils'

import { useRewards } from '../../../../hooks'
import {
  GroupWithCollectionsDto,
  GroupWithRewardsDto,
  RewardsGroupType,
} from '../../../../types'
import { GroupWithCollectionsTiles } from '../GroupWithCollectionsTiles'
import { GroupWithLargeRewardTiles } from '../GroupWithLargeRewardTiles'
import { GroupWithLatestOffers } from '../GroupWithLatestOffers'
import { GroupWithSmallRewardTiles } from '../GroupWithSmallRewardTiles'
import { RewardsItemsGroup } from '../RewardsItemsGroup'

const GROUPS_TO_DISPLAY_IN_GRID = ['trending']
const GROUPS_WITH_LARGE_TILES = ['lastChance']

type Props = {
  categoryId?: string
}

const getWidget = (
  group: GroupWithCollectionsDto | GroupWithRewardsDto,
  isLast: boolean,
) => {
  if (group.type === RewardsGroupType.Collections) {
    const collectionsGroup = group as GroupWithCollectionsDto
    return <GroupWithCollectionsTiles collectionsGroup={collectionsGroup} />
  }

  const groupWithRewards = group as GroupWithRewardsDto

  if (GROUPS_TO_DISPLAY_IN_GRID.includes(groupWithRewards.id)) {
    return (
      <RewardsItemsGroup
        title={groupWithRewards.name}
        rewards={groupWithRewards.rewardsData}
        groupUrl={getRewardsGroupUrl(groupWithRewards.id)}
      />
    )
  }

  if (GROUPS_WITH_LARGE_TILES.includes(groupWithRewards.id)) {
    return (
      <GroupWithLargeRewardTiles groupWithRewards={groupWithRewards} isLast={isLast} />
    )
  }

  return <GroupWithSmallRewardTiles groupWithRewards={groupWithRewards} isLast={isLast} />
}

export const HomeCategoryContent: FC<Props> = ({ categoryId }) => {
  const { getGroupsWithRewardsAndCollections, getGroupedRewards, getLatestRewards } =
    useRewards()
  const groups = categoryId
    ? getGroupedRewards(categoryId)
    : getGroupsWithRewardsAndCollections()

  const latestRewards = getLatestRewards(categoryId)
  const lastGroup = last(groups)
  return (
    <Box>
      <Box mt="s-32">
        <GroupWithLatestOffers latestRewards={latestRewards} />
      </Box>
      {groups.map((group) => (
        <Box key={group.order} mt="s-32">
          {getWidget(group, group === lastGroup)}
        </Box>
      ))}
    </Box>
  )
}
