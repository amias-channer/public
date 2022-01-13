import { useState } from 'react'

import { TOP_UP_PAYMENT_METHOD_SCREENS, TopUpMethod, TopUpScreen } from '../constants'

export const useTopUpMethods = () => {
  const [currentScreen, setCurrentScreen] = useState<TopUpScreen>(
    TopUpScreen.TopUpMethods,
  )

  const handleTopUpShowMethodScreen = (method: TopUpMethod) => {
    setCurrentScreen(TOP_UP_PAYMENT_METHOD_SCREENS[method])
  }

  const handleTopUpShouldChangeMethod = (method: TopUpMethod) => {
    if (method === TopUpMethod.RegularBankTransfer) {
      setCurrentScreen(TopUpScreen.TopUpViaBankTransfer)

      return false
    }

    return true
  }

  const handlePaymentGoBack = () => {
    setCurrentScreen(TopUpScreen.TopUpMethods)
  }

  return {
    currentScreen,
    topUpMethodsScreenProps: {
      shouldChangeMethod: handleTopUpShouldChangeMethod,
      onShowTopUpMethodScreen: handleTopUpShowMethodScreen,
    },
    topUpScreensProps: {
      onGoBack: handlePaymentGoBack,
    },
  }
}
