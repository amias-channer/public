import { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { getRewardsGroupUrl } from '@revolut/rwa-core-utils'

import { RewardsHorizontalTiles, RewardSmallTile } from '../../../../components'
import { GroupWithCollectionsDto } from '../../../../types'

type Props = {
  collectionsGroup: GroupWithCollectionsDto
}

export const GroupWithCollectionsTiles: FC<Props> = ({ collectionsGroup }) => {
  const { t } = useTranslation('pages.RewardsHome')

  return (
    <RewardsHorizontalTiles
      groupId="collections"
      title={t('RewardsGroup.collections')}
      showAll
      trackLastItemVisibility
    >
      {collectionsGroup.collections.map((collection) => (
        <RewardSmallTile
          key={collection.id}
          linkUrl={getRewardsGroupUrl(collection.id)}
          backgroundImgSrc={collection.image}
          title={collection.name}
        />
      ))}
    </RewardsHorizontalTiles>
  )
}
