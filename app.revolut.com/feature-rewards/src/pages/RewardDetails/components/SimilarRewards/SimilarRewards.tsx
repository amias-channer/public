import { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { RewardPartlyDto } from '@revolut/rwa-core-types'
import { getRewardUrl } from '@revolut/rwa-core-utils'

import {
  RewardTileVariant,
  RewardsHorizontalTiles,
  RewardSmallTile,
} from '../../../../components'

type Props = {
  similarRewards: RewardPartlyDto[]
}

export const SimilarRewards: FC<Props> = ({ similarRewards }) => {
  const { t } = useTranslation('pages.RewardDetails')
  return (
    <RewardsHorizontalTiles
      groupId="similarRewards"
      title={t('RewardContent.similarRewardsTitle')}
      tilesVariant={RewardTileVariant.Small}
    >
      {similarRewards.map((similarReward) => (
        <RewardSmallTile
          key={similarReward.id}
          linkUrl={getRewardUrl(similarReward.id)}
          backgroundImgSrc={similarReward.description.picture}
          logoImgSrc={similarReward.merchant.logo}
          title={similarReward.merchant.name}
          brief={similarReward.description.tiny}
          categoryId={similarReward.primaryCategoryId}
        />
      ))}
    </RewardsHorizontalTiles>
  )
}
