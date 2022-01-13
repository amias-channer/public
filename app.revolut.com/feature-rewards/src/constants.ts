import * as Icons from '@revolut/icons'

enum RewardCategory {
  Entertainment = 'entertainment',
  Food = 'food',
  Wellness = 'wellness',
  Travel = 'travel',
  Shopping = 'shopping',
  Essentials = 'essentials',
}

export const REWARD_CATEGORY_ICON = {
  [RewardCategory.Entertainment]: Icons.Entertainment,
  [RewardCategory.Food]: Icons.Restaurants,
  [RewardCategory.Wellness]: Icons.Heart,
  [RewardCategory.Travel]: Icons.Travel,
  [RewardCategory.Shopping]: Icons.Shopping,
  [RewardCategory.Essentials]: Icons.Utilities,
}
