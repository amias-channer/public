import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { ThemeProvider, UnifiedTheme } from '@revolut/ui-kit'

import { AccountDetailsTab } from '@revolut/rwa-core-components'
import { FeatureKey } from '@revolut/rwa-core-config'
import { I18nNamespace, Url } from '@revolut/rwa-core-utils'
import {
  TOP_UP_PAYMENT_METHOD_SCREENS,
  TopUpMethod,
  TopUpMethodsScreen,
  TopUpProvider,
  TopUpScreen,
  TopUpViaBankTransferScreen,
  TopUpViaCardScreen,
} from '@revolut/rwa-feature-topup'

import { useFeaturesConfig } from 'hooks'

export const AccountsTopUp: FC = () => {
  const { t } = useTranslation(I18nNamespace.Common)
  const { isFeatureActive } = useFeaturesConfig()
  const history = useHistory()
  const [currentScreen, setCurrentScreen] = useState<TopUpScreen>(
    TopUpScreen.TopUpMethods,
  )

  const handleTopUpMethodGoBack = () => {
    history.push(Url.Home)
  }

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

  const handleBankTransferAction = () => {
    history.push(Url.Home)
  }

  const handleTopUpSuccess = () => {
    history.push(Url.Home)
  }

  const handlePaymentGoBack = () => {
    setCurrentScreen(TopUpScreen.TopUpMethods)
  }

  const handlePaymentSuccess = () => {
    history.push(Url.Home)
  }

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case TopUpScreen.TopUpMethods:
        return (
          <TopUpMethodsScreen
            shouldChangeMethod={handleTopUpShouldChangeMethod}
            onShowTopUpMethodScreen={handleTopUpShowMethodScreen}
            onTopUpSuccess={handleTopUpSuccess}
            onGoBack={handleTopUpMethodGoBack}
          />
        )
      case TopUpScreen.TopUpViaCard:
        return (
          <TopUpViaCardScreen
            onGoBack={handlePaymentGoBack}
            onSuccess={handlePaymentSuccess}
          />
        )
      case TopUpScreen.TopUpViaBankTransfer:
        return (
          <TopUpViaBankTransferScreen
            renderAccountDetails={(
              user,
              userConfig,
              userCompany,
              selectedPocket,
              accountDetails,
            ) => (
              <AccountDetailsTab
                user={user}
                userConfig={userConfig}
                userCompany={userCompany}
                accountDetails={accountDetails}
                selectedPocket={selectedPocket}
              />
            )}
            submitButtonText={t(`${I18nNamespace.Common}:done`)}
            onGoBack={handlePaymentGoBack}
            onAction={handleBankTransferAction}
          />
        )
      default:
        throw new Error(`Screen ${currentScreen} not reachable. It needs to be handled.`)
    }
  }

  return (
    <ThemeProvider theme={UnifiedTheme}>
      <TopUpProvider
        initialValue={{
          allowTopUpGooglePay: isFeatureActive(FeatureKey.AllowTopUpGooglePay),
        }}
      >
        {renderCurrentScreen()}
      </TopUpProvider>
    </ThemeProvider>
  )
}
