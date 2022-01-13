import { FC } from 'react'
import { Box } from '@revolut/ui-kit'

import { RewardPartlyDto } from '@revolut/rwa-core-types'

import { RewardItemsGrid, RewardsGroupTitle } from '../../../../components'

const SHOW_MAX_ITEMS = 16

type Props = {
  title: string
  rewards: RewardPartlyDto[]
  groupUrl?: string
}

export const RewardsItemsGroup: FC<Props> = ({ title, rewards, groupUrl }) => {
  const shownRewards = rewards.slice(0, SHOW_MAX_ITEMS)
  const showGroupLink = SHOW_MAX_ITEMS < rewards.length
  return (
    <Box>
      <RewardsGroupTitle
        title={title}
        allGroupRewardsLink={showGroupLink ? groupUrl : undefined}
      />
      <Box mt="s-12">
        <RewardItemsGrid rewards={shownRewards} />
      </Box>
    </Box>
  )
}
