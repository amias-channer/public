import { FC, useRef, useState } from 'react'

import {
  AddressDto,
  CardBrand,
  CardDesignDto,
  CheckoutPricingPlanData,
  DeliveryMethodName,
} from '@revolut/rwa-core-types'
import { checkRequired, useNavigateToErrorPage } from '@revolut/rwa-core-utils'

import { CardBrandSelectionScreen } from '../CardBrandSelectionScreen'
import { DeliveryAddressScreen } from '../DeliveryAddressScreen'
import { DeliveryMethodsScreen } from '../DeliveryMethodsScreen'
import { useHandleCardCheckout, useSuccessCardOrder } from '../hooks'
import { PhysicalCardSelectionScreen } from '../PhysicalCardSelectionScreen'
import { PinScreens } from '../PinScreens'
import { PhysicalCardsSuccessOrderPopup } from '../popups'
import { PhysicalCardsOrderingScreen } from './constants'

export const PhysicalCardsOrderingRoute: FC = () => {
  const cardDesignDataRef = useRef<CardDesignDto>()
  const cardBrandRef = useRef<CardBrand>()
  const pricingPlanDataRef = useRef<CheckoutPricingPlanData>()
  const cardPinRef = useRef('')
  const addressValuesRef = useRef<AddressDto>()
  const selectedDeliveryMethodRef = useRef<DeliveryMethodName>()

  const [currentScreen, setCurrentScreen] = useState(
    PhysicalCardsOrderingScreen.PhysicalCardSelectionScreen,
  )

  const navigateToErrorPage = useNavigateToErrorPage()
  const [onSuccessCardOrder, successCardOrderPopupProps] = useSuccessCardOrder()
  const { handleCardCheckout, isCardCheckoutProcessing } = useHandleCardCheckout()

  const handleDataForCheckoutIsReady = () => {
    const cardDesign = checkRequired(
      cardDesignDataRef.current,
      '"cardDesign" can not be empty',
    )
    const cardBrand = cardBrandRef.current ?? (cardDesign.brands[0] as CardBrand)
    const cardPin = checkRequired(cardPinRef.current, '"cardPin" can not be empty')
    const cardDeliveryAddress = checkRequired(
      addressValuesRef.current,
      '"cardDeliveryAddress" can not be empty',
    )
    const cardDeliveryMethod = checkRequired(
      selectedDeliveryMethodRef.current,
      '"cardDeliveryMethod" can not be empty',
    )

    handleCardCheckout({
      cardDesign,
      cardBrand,
      cardPin,
      cardDeliveryAddress,
      cardDeliveryMethod,
      pricingPlanData: pricingPlanDataRef.current,

      onSuccess: onSuccessCardOrder,
      onError: () =>
        navigateToErrorPage(`Error while ordering physical card: ${cardDesign.code}`),
    })
  }

  const handleCardDesignSubmit = (
    cardDesign: CardDesignDto,
    pricingPlanData?: CheckoutPricingPlanData,
  ) => {
    cardDesignDataRef.current = cardDesign
    pricingPlanDataRef.current = pricingPlanData

    if (cardDesign.brands.length > 1) {
      setCurrentScreen(PhysicalCardsOrderingScreen.CardBrandSelectionScreen)
    } else {
      setCurrentScreen(PhysicalCardsOrderingScreen.PinScreens)
    }
  }

  const handleBrandSelectionScreenGoBack = () => {
    setCurrentScreen(PhysicalCardsOrderingScreen.PhysicalCardSelectionScreen)
  }

  const handleCardBrandSubmit = (cardBrand?: CardBrand) => {
    cardBrandRef.current = cardBrand

    setCurrentScreen(PhysicalCardsOrderingScreen.PinScreens)
  }

  const handlePinScreensGoBack = () => {
    setCurrentScreen(PhysicalCardsOrderingScreen.PhysicalCardSelectionScreen)
  }

  const handlePinSubmit = (pin: string) => {
    cardPinRef.current = pin

    setCurrentScreen(PhysicalCardsOrderingScreen.DeliveryAddressScreen)
  }

  const handleDeliveryAddressScreenBack = () => {
    setCurrentScreen(PhysicalCardsOrderingScreen.PinScreens)
  }

  const handleDeliveryAddressScreenSubmit = (
    addressFormValues: AddressDto,
    deliveryMethodName?: DeliveryMethodName,
  ) => {
    addressValuesRef.current = addressFormValues

    if (deliveryMethodName) {
      selectedDeliveryMethodRef.current = deliveryMethodName

      handleDataForCheckoutIsReady()
    } else {
      setCurrentScreen(PhysicalCardsOrderingScreen.DeliveryMethodsScreen)
    }
  }

  const handleDeliveryMethodsScreenBack = () => {
    setCurrentScreen(PhysicalCardsOrderingScreen.DeliveryAddressScreen)
  }

  const handleDeliveryMethodsScreenSubmit = (
    deliveryMethodName: DeliveryMethodName,
    pricingPlanData?: CheckoutPricingPlanData,
  ) => {
    selectedDeliveryMethodRef.current = deliveryMethodName

    if (pricingPlanData) {
      pricingPlanDataRef.current = pricingPlanData
    }

    handleDataForCheckoutIsReady()
  }

  switch (currentScreen) {
    case PhysicalCardsOrderingScreen.PhysicalCardSelectionScreen:
      return <PhysicalCardSelectionScreen onSubmit={handleCardDesignSubmit} />
    case PhysicalCardsOrderingScreen.CardBrandSelectionScreen:
      return (
        <CardBrandSelectionScreen
          cardBrands={
            checkRequired(
              cardDesignDataRef.current,
              'card design should be selected before delivery address screen',
            ).brands as CardBrand[]
          }
          onGoBack={handleBrandSelectionScreenGoBack}
          onSubmit={handleCardBrandSubmit}
        />
      )
    case PhysicalCardsOrderingScreen.PinScreens:
      return <PinScreens onGoBack={handlePinScreensGoBack} onSubmit={handlePinSubmit} />
    case PhysicalCardsOrderingScreen.DeliveryAddressScreen:
      return (
        <>
          <DeliveryAddressScreen
            cardDesign={checkRequired(
              cardDesignDataRef.current,
              'card design should be selected before delivery address screen',
            )}
            planId={pricingPlanDataRef.current?.id}
            isCardCheckoutProcessing={isCardCheckoutProcessing}
            onGoBack={handleDeliveryAddressScreenBack}
            onSubmit={handleDeliveryAddressScreenSubmit}
          />

          <PhysicalCardsSuccessOrderPopup
            tier={checkRequired(
              cardDesignDataRef.current?.tier,
              'card design should be selected before delivery address screen',
            )}
            {...successCardOrderPopupProps}
          />
        </>
      )
    case PhysicalCardsOrderingScreen.DeliveryMethodsScreen:
      return (
        <>
          <DeliveryMethodsScreen
            address={checkRequired(
              addressValuesRef.current,
              'delivery address should be selected before methods screen',
            )}
            cardDesign={checkRequired(
              cardDesignDataRef.current,
              'card design should be selected before methods screen',
            )}
            planId={pricingPlanDataRef.current?.id}
            isCardCheckoutProcessing={isCardCheckoutProcessing}
            onBackClick={handleDeliveryMethodsScreenBack}
            onSubmit={handleDeliveryMethodsScreenSubmit}
          />

          <PhysicalCardsSuccessOrderPopup
            tier={checkRequired(
              cardDesignDataRef.current?.tier,
              'card design should be selected before delivery methods screen',
            )}
            {...successCardOrderPopupProps}
          />
        </>
      )
    default:
      return null
  }
}
