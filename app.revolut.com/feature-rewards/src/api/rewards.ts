import axios from 'axios'

import { RewardsDto, RewardFeedbackDto, RewardFullDto } from '@revolut/rwa-core-types'
import { HttpHeader } from '@revolut/rwa-core-utils'

export type SendFeedbackRequest = {
  rewardId: string
  rewardFeedback: RewardFeedbackDto
}

export const fetchRewards = async (locale?: string) => {
  const headers = locale
    ? {
        [HttpHeader.AcceptLanguage]: locale,
      }
    : undefined
  const { data } = await axios.get<RewardsDto>('/retail/rewards', {
    headers,
  })
  return data
}

export const fetchReward = async (rewardId: string, locale?: string) => {
  const headers = locale
    ? {
        [HttpHeader.AcceptLanguage]: locale,
      }
    : undefined
  const { data } = await axios.get<RewardFullDto>(
    `/retail/rewards/userPerk/${rewardId}`,
    {
      headers,
    },
  )
  return data
}

export const fetchRewardByPublicId = async (rewardId: string, locale?: string) => {
  const headers = locale
    ? {
        [HttpHeader.AcceptLanguage]: locale,
      }
    : undefined
  const { data } = await axios.get<RewardFullDto>(`/retail/rewards/perk/${rewardId}`, {
    headers,
  })
  return data
}

export const redeemReward = (rewardId: string) =>
  axios.post(`retail/rewards/${rewardId}/redeem`)

export const sendFeedback = ({ rewardId, rewardFeedback }: SendFeedbackRequest) =>
  axios.post(`retail/rewards/${rewardId}/feedback`, rewardFeedback)
