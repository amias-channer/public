import * as Sentry from '@sentry/react'

import { PricingPlanDto } from '@revolut/rwa-core-types'
import { getAsset } from '@revolut/rwa-core-utils'
import {
  isPricingPlanMetal,
  isPricingPlanPlus,
  isPricingPlanPremium,
  isPricingPlanStandard,
} from '@revolut/rwa-feature-pricing-plans'

import { CardTier, PHYSICAL_CARD_DESIGN_GROUPS_ORDER } from './constants'
import { PhysicalCardTypesOptions } from './types'

export const isCardColorCrypto = (color: string) => color.startsWith('crypto')

export const isCardCodeFlags = (cardDesignCode: string) =>
  cardDesignCode.startsWith('flag')

export const getCardsColourAsset = (cardCode: string) =>
  getAsset(`card_ordering/cards_colours_rounded/${cardCode}.svg`)

export const getPricingPlanByCardTier = (
  pricingPlans: PricingPlanDto[],
  cardTier: number,
) => {
  switch (cardTier) {
    case CardTier.Standard:
      return pricingPlans.find(isPricingPlanStandard)
    case CardTier.Plus:
      return pricingPlans.find(isPricingPlanPlus)
    case CardTier.Premium:
      return pricingPlans.find(isPricingPlanPremium)
    case CardTier.Metal:
      return pricingPlans.find(isPricingPlanMetal)
    default:
      Sentry.captureException(new Error(`card tier ${cardTier} is unknown`))
      return null
  }
}

export const getPhysicalCardsGroupKey = (groupName: string) =>
  `CardOrdering.physical.group.name.${groupName}`

export const getAvailableCardDesignGroups = (
  physicalCardTypesOptions?: PhysicalCardTypesOptions | null,
) => {
  if (!physicalCardTypesOptions) {
    return []
  }

  return PHYSICAL_CARD_DESIGN_GROUPS_ORDER.filter((designGroup) =>
    Boolean(physicalCardTypesOptions[designGroup]),
  )
}
