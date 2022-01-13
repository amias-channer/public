import { useTranslation } from 'react-i18next'

import { CheckoutResponseDto } from '@revolut/rwa-core-types'
import { I18nNamespace } from '@revolut/rwa-core-utils'

import { CardCheckoutItem } from '../types'

export const useGetCheckoutItems = (cardCheckoutResponse?: CheckoutResponseDto) => {
  const { t } = useTranslation(I18nNamespace.Common)

  if (!cardCheckoutResponse) {
    return []
  }

  const checkoutItems: CardCheckoutItem[] = []

  if (cardCheckoutResponse.plan) {
    checkoutItems.push({
      title: t('facelift.pricing_plan.lowercased', {
        planName: t(`plans.${cardCheckoutResponse.plan.code.toLowerCase()}.name`),
        billingPeriod: t(
          `billing_period.${cardCheckoutResponse.plan.billingCode.toLowerCase()}`,
        ),
      }),
      fee: cardCheckoutResponse.plan.fee,
    })
  }

  const cardCheckoutDesignFeeItem: CardCheckoutItem = {
    title: t('card_fee'),
    fee: cardCheckoutResponse.card.originalDesignFee,
  }

  if (
    cardCheckoutResponse.card.originalDesignFee.amount !==
    cardCheckoutResponse.card.designFee.amount
  ) {
    cardCheckoutDesignFeeItem.discountFee = cardCheckoutResponse.card.designFee
  }

  checkoutItems.push(cardCheckoutDesignFeeItem)

  if (cardCheckoutResponse.card.deliveryFee) {
    const cardCheckoutDeliveryFeeItem: CardCheckoutItem = {
      title: t('card_delivery_fee'),
      fee: cardCheckoutResponse.card.originalDeliveryFee
        ? cardCheckoutResponse.card.originalDeliveryFee
        : cardCheckoutResponse.card.deliveryFee,
    }

    if (
      cardCheckoutResponse.card.originalDeliveryFee &&
      cardCheckoutResponse.card.originalDeliveryFee.amount !==
        cardCheckoutResponse.card.deliveryFee.amount
    ) {
      cardCheckoutDeliveryFeeItem.discountFee = cardCheckoutResponse.card.deliveryFee
    }

    checkoutItems.push(cardCheckoutDeliveryFeeItem)
  }

  return checkoutItems
}
