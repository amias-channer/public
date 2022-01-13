import { CardItemDto } from '@revolut/rwa-core-types'

import {
  CardDeliveryState,
  getCardDeliveryState,
  isDelivered,
  isDisposableCard,
  isLikelyDelivered,
  isVirtualCard,
} from '../../../../helpers'

export const checkIsCardReportingAvailable = (cardData: CardItemDto) => {
  const cardDeliveryState = cardData
    ? getCardDeliveryState(cardData)
    : CardDeliveryState.None

  const isCardLikelyDelivered = isLikelyDelivered(cardDeliveryState)

  const isCardDelivered = isDelivered(cardData)

  return (
    (isCardLikelyDelivered || isCardDelivered) &&
    !isVirtualCard(cardData) &&
    !isDisposableCard(cardData)
  )
}
