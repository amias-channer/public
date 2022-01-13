import { FC } from 'react'
import { Avatar } from '@revolut/ui-kit'

import { TransactionDto } from '@revolut/rwa-core-types'
import { FeatureKey } from '@revolut/rwa-core-config'
import { useFeaturesConfig } from '@revolut/rwa-core-navigation'

import { getAvatar } from './getAvatar'
import { ReversableBox } from './styled'

type Props = {
  transaction: TransactionDto
}

export const TransactionAvatar: FC<Props> = ({ transaction }) => {
  const { isFeatureActive } = useFeaturesConfig() // TODO: remove after 100% deploy of suspicious transfer

  const { image, icon, badgeBg, badgeIcon, isReversed } = getAvatar(
    transaction,
    isFeatureActive(FeatureKey.SuspiciousTransfer), // TODO: remove after 100% deploy of suspicious transfer
  )

  return (
    <ReversableBox reversed={isReversed}>
      <Avatar useIcon={icon} image={image} variant={image ? 'brand' : 'default'}>
        {badgeBg && badgeIcon && <Avatar.Badge useIcon={badgeIcon} bg={badgeBg} />}
      </Avatar>
    </ReversableBox>
  )
}
