import { FC } from 'react'
import { Box, PhotoHeader } from '@revolut/ui-kit'

import { RewardFullDto, RewardPartlyDto } from '@revolut/rwa-core-types'

import { RewardMerchantLogo, RewardLikes } from '../../components'
import { getRewardCategoryIcon } from '../../utils'
import {
  RewardFullDescription,
  RewardRules,
  RewardRating,
  TermsAndConds,
  GoToMerchantButton,
  SimilarRewards,
} from './components'

type Props = {
  reward: RewardFullDto
  similarRewards: RewardPartlyDto[]
  onBackClick: VoidFunction
}

export const RewardContent: FC<Props> = ({ reward, similarRewards, onBackClick }) => {
  return (
    <Box>
      <PhotoHeader image={reward.description.picture}>
        <PhotoHeader.BackButton onClick={onBackClick} />
        <PhotoHeader.Avatar>
          <RewardMerchantLogo logoImgSrc={reward.merchant.logo} />
        </PhotoHeader.Avatar>
        <PhotoHeader.Title>{reward.description.normal}</PhotoHeader.Title>
        <PhotoHeader.Status useIcon={getRewardCategoryIcon(reward.primaryCategoryId)}>
          {reward.merchant.name}
        </PhotoHeader.Status>
        <PhotoHeader.Footer>
          <Box ml="s-8">
            <RewardLikes amount={reward.social_proof?.likes || 0} />
          </Box>
        </PhotoHeader.Footer>
      </PhotoHeader>

      <Box mt="s-16">
        <RewardFullDescription description={reward.description.verbose} />
      </Box>
      <Box mt="s-32">
        <RewardRules rewardRules={reward.steps} />
      </Box>
      <Box mt="s-16">
        <RewardRating rewardId={reward.id} rating={reward.feedback?.rating} />
      </Box>
      <Box mt="s-32">
        <SimilarRewards similarRewards={similarRewards} />
      </Box>
      {reward.description.terms && (
        <Box mt="s-16">
          <TermsAndConds termsUrl={reward.description.terms} rewardId={reward.id} />
        </Box>
      )}
      <Box mt="s-56" />
      <GoToMerchantButton
        rewardId={reward.id}
        copyPromoCode={reward.details.promoCode}
        url={reward.details.webhook}
        merchantName={reward.merchant.name}
      />
    </Box>
  )
}
