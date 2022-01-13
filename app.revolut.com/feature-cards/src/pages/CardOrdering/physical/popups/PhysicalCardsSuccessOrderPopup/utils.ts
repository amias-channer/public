import findKey from 'lodash/findKey'

import { checkRequired } from '@revolut/rwa-core-utils'

import { CardTier } from '../../PhysicalCardSelectionScreen/constants'

export const getCardTierName = (cardTier: number) =>
  checkRequired(
    findKey(CardTier, (value) => value === cardTier),
    `Card tier should be handled (card tier: ${cardTier})`,
  )
