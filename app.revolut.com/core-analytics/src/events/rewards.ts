import { RetailEventOptions, COAWebEvent } from 'aqueduct-web'

import { OBJECT_TYPES } from './objectTypes'

const REWARD_EVENTS = {
  detailsOpened: {
    category: COAWebEvent.Category.Perks,
    action: COAWebEvent.Action.opened,
    object: 'PerkDetails',
    description: 'Track opening perk (source, perk id and time left)',
    objectType: OBJECT_TYPES.PAGE,
  },
  detailsClosed: {
    category: COAWebEvent.Category.Perks,
    action: COAWebEvent.Action.closed,
    object: 'PerkDetails',
    description: 'Track closing perk (perk id and time left)',
    objectType: OBJECT_TYPES.PAGE,
  },
  voucherCodeCopied: {
    category: COAWebEvent.Category.Perks,
    action: COAWebEvent.Action.clicked,
    object: 'Vouchercode',
    description: 'Track when a user copies the voucher code',
    objectType: OBJECT_TYPES.DATA,
  },
  webhookClicked: {
    category: COAWebEvent.Category.Perks,
    action: COAWebEvent.Action.clicked,
    object: 'SinglePerkWebhook',
    description: 'Track when user clicks external link in perk (perk id, url)',
    objectType: OBJECT_TYPES.BUTTON,
  },
  termsAncConditionsClicked: {
    category: COAWebEvent.Category.Perks,
    action: COAWebEvent.Action.clicked,
    object: 'SinglePerkTandC',
    description: 'Track terms and conditions click (perk id)',
    objectType: OBJECT_TYPES.BUTTON,
  },
  termsAncConditionsViewed: {
    category: COAWebEvent.Category.Perks,
    action: COAWebEvent.Action.viewed,
    object: 'SinglePerkTandC',
    description: 'Track when terms and conditions button is shown on screen (perk id)',
    objectType: OBJECT_TYPES.BUTTON,
  },
  likeButtonClicked: {
    category: COAWebEvent.Category.Perks,
    action: COAWebEvent.Action.clicked,
    object: 'LikeButton',
    description: 'Track perk liked (source, perk id)',
    objectType: OBJECT_TYPES.BUTTON,
  },
  dislikeButtonClicked: {
    category: COAWebEvent.Category.Perks,
    action: COAWebEvent.Action.clicked,
    object: 'DislikeButton',
    description: 'Track perk disliked (source, perk id)',
    objectType: OBJECT_TYPES.BUTTON,
  },
  shopperBannerAddToChromeButtonClicked: {
    category: COAWebEvent.Category.Perks,
    action: COAWebEvent.Action.clicked,
    object: 'ShopperBannerAddToChromeButton',
    description:
      'Track Shopper banner "Add to chrome" button clicked on accounts page in Retail web app',
    objectType: OBJECT_TYPES.BUTTON,
  },
  shopperBannerCloseButtonClicked: {
    category: COAWebEvent.Category.Perks,
    action: COAWebEvent.Action.clicked,
    object: 'ShopperBannerCloseButton',
    description:
      'Track Shopper banner close button clicked on accounts page in Retail web app',
    objectType: OBJECT_TYPES.BUTTON,
  },
}

const REWARDS_LIST_EVENTS = {
  listOpened: {
    category: COAWebEvent.Category.Perks,
    action: COAWebEvent.Action.opened,
    object: 'PerksList',
    description:
      'Track opening perks list (send source, number of perks, perk meter count, if perk meter has more perks)',
    objectType: OBJECT_TYPES.PAGE,
  },
  listClosed: {
    category: COAWebEvent.Category.Perks,
    action: COAWebEvent.Action.closed,
    object: 'PerksList',
    description:
      'Track closing perks list (send number of perks, perk meter count, if perk meter has more perks)',
    objectType: OBJECT_TYPES.PAGE,
  },
  searchClicked: {
    category: COAWebEvent.Category.Perks,
    action: COAWebEvent.Action.clicked,
    object: 'Search',
    description: 'Tracking the search term by the user',
    objectType: OBJECT_TYPES.BUTTON,
  },
  horizontalCategoryClicked: {
    category: COAWebEvent.Category.Perks,
    action: COAWebEvent.Action.clicked,
    object: 'HorizontalCategory',
    description: 'Track when a user open a category',
    objectType: OBJECT_TYPES.BUTTON,
  },
  lastVerticalCategoryViewed: {
    category: COAWebEvent.Category.Perks,
    action: COAWebEvent.Action.viewed,
    object: 'LastVerticalCategory',
    description: 'Track last section viewed',
    objectType: OBJECT_TYPES.ELEMENT,
  },
  lastItemInVerticalCategoryViewed: {
    category: COAWebEvent.Category.Perks,
    action: COAWebEvent.Action.viewed,
    object: 'LastPerkInVertical',
    description: 'Track when the last perk in a vertical category has appeared on screen',
    objectType: OBJECT_TYPES.ELEMENT,
  },
} as const

export const RewardTrackingEvent: Record<
  keyof typeof REWARD_EVENTS,
  RetailEventOptions<string>
> = REWARD_EVENTS

export const RewardsListTrackingEvent: Record<
  keyof typeof REWARDS_LIST_EVENTS,
  RetailEventOptions<string>
> = REWARDS_LIST_EVENTS
