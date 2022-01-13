import { FC } from 'react'
import { Flex, Box } from '@revolut/ui-kit'

import { RewardPartlyDto } from '@revolut/rwa-core-types'

import { RewardSmallTile } from '../RewardSmallTile'

type Props = {
  rewards: RewardPartlyDto[]
  showOrderNumbers?: boolean
  getRewardDetailsUrl: (rewardId: string) => string
}

export const RewardsTilesGrid: FC<Props> = ({ rewards, getRewardDetailsUrl }) => (
  <Flex flexWrap="wrap" mr={{ md: '-16px', all: '-6px' }}>
    {rewards.map((reward) => (
      <Box
        key={reward.id}
        mr={{ md: 's-16', all: 's-6' }}
        mb={{ md: 's-16', all: 's-6' }}
      >
        <RewardSmallTile
          linkUrl={getRewardDetailsUrl(reward.id)}
          backgroundImgSrc={reward.description.picture}
          logoImgSrc={reward.merchant.logo}
          brief={reward.description.tiny}
          title={reward.merchant.name}
          categoryId={reward.primaryCategoryId}
        />
      </Box>
    ))}
  </Flex>
)
