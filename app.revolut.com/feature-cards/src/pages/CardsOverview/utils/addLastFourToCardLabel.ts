import { BULLET } from '@revolut/rwa-core-utils'

export const addLastFourToCardLabel = (cardLabel: string, lastFour: string) =>
  `${cardLabel} ${BULLET}${BULLET}${lastFour}`
