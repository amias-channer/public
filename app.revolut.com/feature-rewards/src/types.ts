import {
  RewardsCollectionDto,
  RewardCategoryDto,
  RewardPartlyDto,
} from '@revolut/rwa-core-types'

export enum RewardsGroupType {
  Collections = 'collections',
  Rewards = 'rewards',
}

export type RewardsCollectionWithNameDto = RewardsCollectionDto & { name: string }

export type GroupWithRewardsDto = RewardCategoryDto & {
  rewardsData: RewardPartlyDto[]
  type: RewardsGroupType
}

export type GroupWithCollectionsDto = {
  type: RewardsGroupType
  order: number
  collections: RewardsCollectionWithNameDto[]
}
