import { CardExpiryDate, UserTopupCardDto } from '@revolut/rwa-core-types'
import { BULLET } from '@revolut/rwa-core-utils'

export const formatExpiryDate = (expiryDate: CardExpiryDate) =>
  `${expiryDate.month}/${String(expiryDate.year).substr(2, 2)}`

export const formatCardBrandAndNumber = (card: UserTopupCardDto) =>
  `${card.issuer.cardBrand} ${BULLET}${BULLET}${card.lastFour}`
