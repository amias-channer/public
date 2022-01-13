import { sortBy, reverse, compact, isEmpty, flatten, uniq, take, pull } from 'lodash'
import { useCallback, useMemo } from 'react'
import { useQuery } from 'react-query'

import { useLocale } from '@revolut/rwa-core-i18n'
import { RewardCategoryDto, RewardPartlyDto } from '@revolut/rwa-core-types'
import { checkRequired, QueryKey } from '@revolut/rwa-core-utils'

import { fetchRewards } from '../../api'
import {
  GroupWithCollectionsDto,
  GroupWithRewardsDto,
  RewardsGroupType,
} from '../../types'

type useRewardsReturn = {
  isError: boolean
  isSuccess: boolean
  categories: RewardCategoryDto[]

  getRewardsAmount: () => number
  getLatestRewards: (categoryId?: string) => RewardPartlyDto[]
  getGroupsWithRewardsAndCollections: () => Array<
    GroupWithCollectionsDto | GroupWithRewardsDto
  >
  getGroupedRewards: (categoryId?: string) => GroupWithRewardsDto[]
  getRewardsInCategory: (categoryId: string) => RewardPartlyDto[]
  getSimilarRewards: (rewarId: string) => RewardPartlyDto[]
  getRewardsGroup: (groupId: string) => GroupWithRewardsDto | undefined
  searchRewards: (query: string) => RewardPartlyDto[]
}

export const GROUP_WITH_COLLECTIONS_ID = 'rewards-group-with-collections'

const MAX_SIMILAR_REWARDS = 5
const MAX_LATESTS_REWARDS = 15

export const useRewards: () => useRewardsReturn = () => {
  const { locale } = useLocale()
  const { isError, isSuccess, data } = useQuery([QueryKey.Rewards, locale], () =>
    fetchRewards(locale),
  )

  const categories: RewardCategoryDto[] = useMemo(() => {
    if (isError || isEmpty(data)) {
      return []
    }

    return sortBy(data?.categories.horizontal, (category) => category.order)
  }, [isError, data])

  const getRewardsAmount = useCallback(() => {
    if (isError || isEmpty(data)) {
      return 0
    }

    return data?.rewards.length || 0
  }, [data, isError])

  const getLatestRewards = useCallback(
    (categoryId?: string) => {
      if (isError || isEmpty(data)) {
        return []
      }
      const rewardsWithStartDate = data?.rewards.filter(
        (reward) =>
          reward.start && (categoryId ? reward.primaryCategoryId === categoryId : true),
      )
      const sorted = reverse(sortBy(rewardsWithStartDate, (reward) => reward.start))
      return sorted.slice(0, MAX_LATESTS_REWARDS)
    },
    [data, isError],
  )

  const getGroupedRewards = useCallback(
    (category?: string) => {
      if (isError || isEmpty(data)) {
        return []
      }

      const responseData = checkRequired(data, 'data should be defined')

      const sortedGroups = sortBy(
        responseData.categories.vertical,
        (group) => group.order,
      )

      const groups: GroupWithRewardsDto[] = sortedGroups
        .map((group) => {
          const rewardsData = compact(
            group.perks.map((rewardId) => {
              const foundReward = responseData.rewards.find(
                (reward) => reward.id === rewardId,
              )
              if (category && foundReward?.primaryCategoryId !== category) {
                return undefined
              }
              return foundReward
            }),
          )
          return {
            ...group,
            rewardsData,
            type: RewardsGroupType.Rewards,
          }
        })
        .filter((group) => !isEmpty(group.rewardsData))

      return groups
    },
    [data, isError],
  )

  const getGroupsWithRewardsAndCollections = useCallback(() => {
    if (isError || isEmpty(data)) {
      return []
    }

    const responseData = checkRequired(data, 'data should be defined')

    const groupsWithRewards = getGroupedRewards()

    const collectionIds = responseData.collections.categories.map(
      (collection) => collection.id,
    )

    if (isEmpty(collectionIds)) {
      return groupsWithRewards
    }

    const filteredGroups =
      groupsWithRewards.filter((group) => !collectionIds.includes(group.id)) || []

    const collectionsWithNames = responseData.collections.categories.map((collection) => {
      const rewardsGroup = responseData.categories.vertical.find(
        (category) => category.id === collection.id,
      )
      return rewardsGroup
        ? {
            ...collection,
            name: rewardsGroup.name,
          }
        : undefined
    })

    const groupWithCollectionsDto: GroupWithCollectionsDto = {
      type: RewardsGroupType.Collections,
      order: responseData.collections.order,
      collections: compact(collectionsWithNames),
    }

    return sortBy([...filteredGroups, groupWithCollectionsDto], (group) => group.order)
  }, [data, getGroupedRewards, isError])

  const getRewardsInCategory = useCallback(
    (categoryId: string) => {
      if (isError || isEmpty(data)) {
        return []
      }

      const currentCategory = data?.categories.horizontal.find(
        (category) => category.id === categoryId,
      )

      if (!currentCategory) {
        return []
      }

      const rewards = currentCategory.perks.map((rewardId) => {
        return data?.rewards.find((reward) => reward.id === rewardId)
      })

      return compact(rewards)
    },
    [isError, data],
  )

  const getSimilarRewards = useCallback(
    (rewardId: string) => {
      if (isError || isEmpty(data)) {
        return []
      }

      const neighborRewards = data?.categories.horizontal
        .filter((category) => category.perks.includes(rewardId))
        .map((category) => category.perks)

      const similarRewards = pull(uniq(flatten(neighborRewards)), rewardId).map((id) => {
        return data?.rewards.find((reward) => reward.id === id)
      })

      return take(compact(similarRewards), MAX_SIMILAR_REWARDS)
    },
    [isError, data],
  )

  const getRewardsGroup = useCallback(
    (groupId: string) => {
      if (isError || isEmpty(data)) {
        return undefined
      }

      const groupData = data?.categories.vertical.find((group) => group.id === groupId)

      if (!groupData) {
        return undefined
      }

      const rewardsData = compact(
        groupData.perks.map((rewardId) =>
          data?.rewards.find((reward) => reward.id === rewardId),
        ),
      )

      return {
        ...groupData,
        rewardsData,
        type: RewardsGroupType.Rewards,
      }
    },
    [data, isError],
  )

  const searchRewards = useCallback(
    (query: string) => {
      if (isError || isEmpty(data)) {
        return []
      }

      const lowerCasedQuery = query.toLowerCase()

      const filteredRewards = data?.rewards.filter((reward) => {
        return (
          reward.merchant.name.toLowerCase().includes(lowerCasedQuery) ||
          reward.description.normal.toLowerCase().includes(lowerCasedQuery)
        )
      })
      return filteredRewards || []
    },
    [data, isError],
  )

  return {
    isError,
    isSuccess,
    categories,

    getRewardsAmount,
    getLatestRewards,
    getGroupedRewards,
    getGroupsWithRewardsAndCollections,
    getRewardsInCategory,
    getSimilarRewards,
    getRewardsGroup,
    searchRewards,
  }
}
