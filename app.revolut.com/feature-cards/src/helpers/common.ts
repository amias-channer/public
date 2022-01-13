import isFuture from 'date-fns/isFuture'

import {
  CardBrand,
  CardDeliveryStatus,
  CardCode,
  CardItemDto,
  CardState,
} from '@revolut/rwa-core-types'
import { getAsset, getHomeUrl } from '@revolut/rwa-core-utils'

export enum CardDeliveryState {
  None = 'NONE',
  PinActivation = 'PIN_ACTIVATION',
  PanActivation = 'PAN_ACTIVATION',
  Delivering = 'DELIVERING',
}

export const getCardDeliveryState = (cardData: CardItemDto): CardDeliveryState => {
  if (!cardData.delivery?.edt) {
    return CardDeliveryState.None
  }

  const cardDeliveryDate = new Date(cardData.delivery.edt)

  if (!isFuture(cardDeliveryDate)) {
    if (cardData.panDeliveryConfirmation) {
      return CardDeliveryState.PanActivation
    }

    return CardDeliveryState.PinActivation
  }

  return CardDeliveryState.Delivering
}

export const isLikelyDelivered = (cardDeliveryState: CardDeliveryState): boolean => {
  return (
    cardDeliveryState === CardDeliveryState.PanActivation ||
    cardDeliveryState === CardDeliveryState.PinActivation
  )
}

export const isDelivered = (cardData?: CardItemDto): boolean => {
  return cardData?.delivery?.status === CardDeliveryStatus.Delivered
}

export const isCardPaymentPending = (cardData?: CardItemDto) =>
  cardData?.state === CardState.Pending

const CARDS_IMAGES_DIR = 'card_designs'

export const getCardSettingsImage = (brand: CardBrand, design: CardCode) => {
  const cardDesignLowerCased = design.toLowerCase()

  if (brand === CardBrand.Mastercard) {
    return getAsset(`${CARDS_IMAGES_DIR}/mastercard/${cardDesignLowerCased}.png`)
  }

  return getAsset(`${CARDS_IMAGES_DIR}/visa/${cardDesignLowerCased}.png`)
}

export const getCardOrderDesignImage = (brand: string, design: string) =>
  getAsset(`${CARDS_IMAGES_DIR}/large/${brand}/${design}.png`)

export const getCardsListItemDesignImage = (brand: string, design: string) =>
  getAsset(`${CARDS_IMAGES_DIR}/small/${brand.toLowerCase()}/${design.toLowerCase()}.png`)

export const isVirtualCard = (card?: CardItemDto) =>
  card?.design === CardCode.OriginalVirtual

export const isDisposableCard = (card?: CardItemDto) =>
  card?.design === CardCode.OriginalDisposable

export const isCardDesignJunior = (card?: CardItemDto): boolean => {
  if (!card?.design) {
    return false
  }

  return card.design.startsWith('YOUTH_')
}

export const getCardsOverviewUrl = () => getHomeUrl({ tab: 'cards', queryParams: {} })
