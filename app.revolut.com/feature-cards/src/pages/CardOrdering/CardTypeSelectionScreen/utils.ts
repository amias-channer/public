import { getAsset } from '@revolut/rwa-core-utils'

export enum CardSelectionType {
  Debit = 'debit',
  Virtual = 'virtual',
}

export const getAssetUrl = (cardType: CardSelectionType) =>
  getAsset(`card_ordering/${cardType}_cards.png`)
