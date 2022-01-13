import { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { RewardType, RewardPartlyDto } from '@revolut/rwa-core-types'
import { getRewardUrl } from '@revolut/rwa-core-utils'

import {
  RewardsHorizontalTiles,
  RewardItem,
  RewardTileVariant,
} from '../../../../components'

type Props = {
  latestRewards: RewardPartlyDto[]
}

export const GroupWithLatestOffers: FC<Props> = ({ latestRewards }) => {
  const { t } = useTranslation('pages.RewardsHome')

  return (
    <RewardsHorizontalTiles
      groupId="latestOffers"
      title={t('RewardsGroup.latestOffers')}
      tilesVariant={RewardTileVariant.Tiny}
      carouselWrapProps={{
        py: 's-12',
        bg: 'rewardTilesListSecondaryBackground',
      }}
      showAll
      trackLastItemVisibility
    >
      {latestRewards.map((reward) => (
        <RewardItem
          key={reward.id}
          linkUrl={getRewardUrl(reward.id)}
          logoImgSrc={reward.merchant.logo}
          merchantName={reward.merchant.name}
          tinyDescription={reward.description.tiny}
          isCashback={reward.type === RewardType.Cashback}
        />
      ))}
    </RewardsHorizontalTiles>
  )
}
