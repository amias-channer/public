import { CardItemDto, CardState } from '@revolut/rwa-core-types'

export const checkIsCardFrozen = (cardData: CardItemDto) =>
  cardData.state === CardState.Blocked
