import { chunk, fill } from 'lodash'
import { FC, useMemo } from 'react'
import { Box, Cell, Flex } from '@revolut/ui-kit'

import { RewardPartlyDto, RewardType } from '@revolut/rwa-core-types'
import { getRewardUrl } from '@revolut/rwa-core-utils'

import { RewardItem } from '../RewardItem'

const SHOW_IN_ROW = 5

type Props = {
  rewards: RewardPartlyDto[]
}

export const RewardItemsGrid: FC<Props> = ({ rewards }) => {
  const chunkedRewards = useMemo(
    () =>
      chunk(rewards, SHOW_IN_ROW).map((chunked) => {
        if (chunked.length === SHOW_IN_ROW) {
          return chunked
        }
        return [...chunked, ...fill(Array(SHOW_IN_ROW - chunked.length), undefined)]
      }),
    [rewards],
  )
  return (
    <Cell flexWrap="wrap">
      {chunkedRewards.map((rewardsInChuck, lineIndex) => (
        // eslint-disable-next-line react/no-array-index-key
        <Flex justifyContent="space-between" mt="s-16" key={lineIndex} width="100%">
          {rewardsInChuck.map((reward, index) =>
            reward ? (
              <RewardItem
                key={reward.id}
                linkUrl={getRewardUrl(reward.id)}
                logoImgSrc={reward.merchant.logo}
                merchantName={reward.merchant.name}
                tinyDescription={reward.description.tiny}
                isCashback={reward.type === RewardType.Cashback}
              />
            ) : (
              // eslint-disable-next-line react/no-array-index-key
              <Box key={index} width="components.Rewards.RewardItem.width" />
            ),
          )}
        </Flex>
      ))}
    </Cell>
  )
}
