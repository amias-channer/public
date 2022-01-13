import { useQueryClient, useMutation, useQuery } from 'react-query'

import { useLocale } from '@revolut/rwa-core-i18n'
import { RewardRatingFeedback } from '@revolut/rwa-core-types'
import { checkRequired, QueryKey } from '@revolut/rwa-core-utils'

import {
  fetchReward,
  redeemReward as redeemRewardApi,
  sendFeedback as sendFeedbackApi,
} from '../../api'

const ID_SHOULD_EXIST_MESSAGE = 'reward id should be defined'

export const useReward = (rewardId: string) => {
  const queryClient = useQueryClient()
  const { locale } = useLocale()

  const {
    isSuccess: isRewardFetched,
    isError: isRewardFetchFailed,
    data: rewardData,
  } = useQuery([QueryKey.Reward, rewardId, locale], () => fetchReward(rewardId, locale))

  const { mutate: redeemReward } = useMutation(redeemRewardApi)
  const { mutate: sendFeedback } = useMutation(sendFeedbackApi, {
    onSettled: () => {
      queryClient.invalidateQueries([QueryKey.Reward, rewardId, locale])
    },
  })

  const redeem = () => {
    const id = checkRequired(rewardData?.id, ID_SHOULD_EXIST_MESSAGE)

    redeemReward(id)
  }

  const like = () => {
    const id = checkRequired(rewardData?.id, ID_SHOULD_EXIST_MESSAGE)

    sendFeedback({
      rewardId: id,
      rewardFeedback: { rating: RewardRatingFeedback.Like },
    })
  }

  const dislike = (comment: string) => {
    const id = checkRequired(rewardData?.id, ID_SHOULD_EXIST_MESSAGE)

    sendFeedback({
      rewardId: id,
      rewardFeedback: { rating: RewardRatingFeedback.Dislike, comment },
    })
  }

  const undoFeedback = () => {
    const id = checkRequired(rewardData?.id, ID_SHOULD_EXIST_MESSAGE)

    sendFeedback({
      rewardId: id,
      rewardFeedback: { rating: RewardRatingFeedback.Default },
    })
  }

  return {
    rewardData,
    isRewardFetched,
    isRewardFetchFailed,

    redeem,
    like,
    dislike,
    undoFeedback,
  }
}
