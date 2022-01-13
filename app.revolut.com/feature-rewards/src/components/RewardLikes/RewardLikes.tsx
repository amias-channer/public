import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Profile as ProfileIcon } from '@revolut/icons'
import { Text, Box, Circle, Flex } from '@revolut/ui-kit'

import { IconSize, formatLikesAmount } from '@revolut/rwa-core-utils'

type Props = {
  amount: number
}

export const RewardLikes: FC<Props> = ({ amount }) => {
  const { t } = useTranslation('components.Rewards')

  return amount > 0 ? (
    <Flex alignItems="center" height="components.Rewards.LikeBox.height">
      <Box>
        <Circle
          size={IconSize.Small}
          variant="outlined"
          color="rewardLikeIconColor"
          bg="rewardLikeIconBaground"
        >
          <ProfileIcon size={IconSize.Small} />
        </Circle>
      </Box>
      <Box ml="s-8">
        <Text use="p" variant="small" color="likesTitle">
          {t('RewardLikes.text', { amount: formatLikesAmount(amount) })}
        </Text>
      </Box>
    </Flex>
  ) : null
}
