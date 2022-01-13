import { CardItemDto, CardState } from '@revolut/rwa-core-types'
import { useGetUserCards } from '@revolut/rwa-core-api'

import { isCardFrozenDueToSuspiciousTransaction } from '../../utils'

const getFrozenCardBySuspiciousTransaction = (
  cards?: CardItemDto[],
): CardItemDto | undefined =>
  cards?.find(
    (card) =>
      card.state === CardState.Blocked && isCardFrozenDueToSuspiciousTransaction(card),
  )

export const useCardWithSuspiciousTransaction = () => {
  const { cards } = useGetUserCards()

  return getFrozenCardBySuspiciousTransaction(cards)
}
