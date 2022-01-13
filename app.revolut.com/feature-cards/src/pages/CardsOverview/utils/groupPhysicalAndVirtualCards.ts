import groupBy from 'lodash/groupBy'

import { CardItemDto } from '@revolut/rwa-core-types'

enum CardGroupingType {
  Physical = 'PHYSICAL',
  Virtual = 'VIRTUAL',
}

export const groupPhysicalAndVirtualCards = (cards: CardItemDto[]) => {
  const groupedCards = groupBy(cards, (card) =>
    card.virtual ? CardGroupingType.Virtual : CardGroupingType.Physical,
  )

  return {
    physicalCards: groupedCards[CardGroupingType.Physical] ?? [],
    virtualCards: groupedCards[CardGroupingType.Virtual] ?? [],
  }
}
