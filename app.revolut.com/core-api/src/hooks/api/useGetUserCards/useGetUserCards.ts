import { CardItemDto } from '@revolut/rwa-core-types'

import { useGetAllCards } from '../useGetAllCards'
import { useQueryWallet } from '../useQueryWallet'

type UseGetUserCardsReturn = {
  cards?: CardItemDto[]
  isFetching: boolean
}

export const useGetUserCards = (): UseGetUserCardsReturn => {
  const { data: userWallet } = useQueryWallet()
  const { cards } = useGetAllCards()

  if (cards && userWallet) {
    return {
      cards: cards.filter((card) => card.walletId === userWallet.id),
      isFetching: false,
    }
  }

  return { isFetching: true }
}
