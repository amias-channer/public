import { FC, useEffect } from 'react'
import { useQuery } from 'react-query'
import { useParams, useHistory } from 'react-router-dom'

import { QueryKey, Url, getRewardUrl } from '@revolut/rwa-core-utils'

import { fetchRewardByPublicId } from '../../api'
import { RewardsLayout } from '../../components'

type UrlParams = {
  rewardPublicId: string
}

export const RedirectToRewardInstance: FC = () => {
  const { rewardPublicId } = useParams<UrlParams>()

  const { data, isError } = useQuery([QueryKey.RewardPublic, rewardPublicId], () =>
    fetchRewardByPublicId(rewardPublicId),
  )

  const history = useHistory()

  useEffect(() => {
    if (data?.id) {
      history.replace(getRewardUrl(data.id))
      return
    }

    if (isError) {
      history.push(Url.RewardsHome)
    }
  }, [data?.id, history, isError])

  return <RewardsLayout isLoading />
}
