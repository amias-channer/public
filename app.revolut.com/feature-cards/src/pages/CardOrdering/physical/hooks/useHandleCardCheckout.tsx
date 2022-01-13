import { useCallback } from 'react'

import {
  AddressDto,
  CardBrand,
  CardDesignDto,
  CheckoutCardDto,
  CheckoutPricingPlanData,
  CheckoutResponseDto,
  DeliveryMethodName,
} from '@revolut/rwa-core-types'
import { encryptText } from '@revolut/rwa-core-utils'

import { useCheckoutCard } from '../../hooks'

type UseCardCheckoutCallbackArgs = {
  cardDesign: CardDesignDto
  cardBrand: CardBrand
  cardPin: string
  cardDeliveryAddress: AddressDto
  cardDeliveryMethod: DeliveryMethodName
  pricingPlanData?: CheckoutPricingPlanData
  onSuccess: (data: CheckoutResponseDto) => void
  onError: () => void
}

export const useHandleCardCheckout = () => {
  const { checkoutCard, isLoading: isCardCheckoutProcessing } = useCheckoutCard()

  const handleCardCheckout = useCallback(
    ({
      cardDesign,
      cardBrand,
      cardPin,
      cardDeliveryAddress,
      cardDeliveryMethod,
      pricingPlanData,
      onSuccess,
      onError,
    }: UseCardCheckoutCallbackArgs) => {
      const checkoutData: CheckoutCardDto = {
        card: {
          brand: cardBrand,
          deliveryAddress: cardDeliveryAddress,
          deliveryMethod: cardDeliveryMethod,
          design: cardDesign.code.toUpperCase(),
          virtual: false,
          disposable: false,
          pin: encryptText(cardPin),
        },
      }

      if (pricingPlanData) {
        checkoutData.plan = pricingPlanData
      }

      checkoutCard(checkoutData, {
        onSuccess,
        onError,
      })
    },
    [checkoutCard],
  )

  return {
    handleCardCheckout,
    isCardCheckoutProcessing,
  }
}
