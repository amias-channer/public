const GOOD_RATE = 4

export const isRateGood = (rate: number): boolean => rate >= GOOD_RATE

export const isRateBad = (rate: number): boolean => rate > 0 && rate < GOOD_RATE
