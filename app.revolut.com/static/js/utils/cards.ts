import { CardFee } from '@revolut/rwa-core-types'

type GetTotalCardFeeArgs = {
  designFee: CardFee
  deliveryFee?: CardFee
}

export const getTotalCardFee = ({
  designFee,
  deliveryFee,
}: GetTotalCardFeeArgs): CardFee => ({
  amount: designFee.amount + (deliveryFee?.amount ?? 0),
  currency: designFee.currency,
})
