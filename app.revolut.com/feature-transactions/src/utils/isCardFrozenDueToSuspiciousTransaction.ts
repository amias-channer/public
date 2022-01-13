import { CardItemDto, CardStateReason } from '@revolut/rwa-core-types'

export const isCardFrozenDueToSuspiciousTransaction = (card: CardItemDto) =>
  card.stateReason === CardStateReason.DeclinedByFraudDetectorTransaction
