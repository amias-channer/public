import { MoneyDto } from '@revolut/rwa-core-types'

export const isFree = (fee: MoneyDto) => {
  return fee.amount === 0
}
