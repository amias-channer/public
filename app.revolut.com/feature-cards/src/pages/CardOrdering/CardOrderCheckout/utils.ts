import { CardCheckoutItem } from './types'

export const getFullCheckoutAmount = (checkoutItems: CardCheckoutItem[]) => {
  const fullAmount = checkoutItems.reduce(
    (checkoutAmount, checkoutItem) =>
      (checkoutItem.discountFee?.amount ?? checkoutItem.fee.amount) + checkoutAmount,
    0,
  )

  return {
    amount: fullAmount,
    currency: checkoutItems[0].fee.currency,
  }
}
