import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { SocialLike as LikeIcon, SocialDislike as DislikeIcon } from '@revolut/icons'
import { Box, Cell, Flex, ToggleButton, Text } from '@revolut/ui-kit'

import { trackEvent, RewardTrackingEvent } from '@revolut/rwa-core-analytics'
import { RewardRatingFeedback } from '@revolut/rwa-core-types'
import { browser, getRewardFeedbackUrl } from '@revolut/rwa-core-utils'

import { useReward } from '../../../../hooks'

type Props = {
  rewardId: string
  rating?: RewardRatingFeedback
}

export const RewardRating: FC<Props> = ({ rewardId, rating }) => {
  const { like, undoFeedback } = useReward(rewardId)
  const history = useHistory()

  const isLiked = rating === RewardRatingFeedback.Like
  const isDisliked = rating === RewardRatingFeedback.Dislike

  const { t } = useTranslation('pages.RewardDetails')

  const getFeedback = () => {
    history.push(getRewardFeedbackUrl(rewardId, browser.getSearch()))
  }

  const onLikeClick = () => {
    if (isLiked) {
      undoFeedback()
    }

    like()
    trackEvent(RewardTrackingEvent.likeButtonClicked, {
      perkId: rewardId,
    })
  }

  const onDislikeClick = () => {
    if (isDisliked) {
      undoFeedback()
    }
    trackEvent(RewardTrackingEvent.dislikeButtonClicked, {
      perkId: rewardId,
    })
    getFeedback()
  }

  return (
    <Cell flexWrap="wrap">
      <Text use="p" variant="caption" color="rewardsText">
        {t('RewardRating.text')}
      </Text>
      <Flex mt="s-16" justifyContent="center" width="100%">
        <Box>
          <ToggleButton
            useIcon={DislikeIcon}
            checked={isDisliked}
            onChange={onDislikeClick}
          >
            {t('RewardRating.dislikeButton')}
          </ToggleButton>
        </Box>
        <Box ml="s-8">
          <ToggleButton useIcon={LikeIcon} checked={isLiked} onChange={onLikeClick}>
            {t('RewardRating.likeButton')}
          </ToggleButton>
        </Box>
      </Flex>
    </Cell>
  )
}
