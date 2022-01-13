import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { ThemeProvider, UnifiedTheme } from '@revolut/ui-kit'

import { AccountDetailsTab } from '@revolut/rwa-core-components'
import { FeatureKey } from '@revolut/rwa-core-config'
import { useFeaturesConfig } from '@revolut/rwa-core-navigation'
import { I18nNamespace } from '@revolut/rwa-core-utils'
import {
  TopUpMethodsScreen,
  TopUpProvider,
  TopUpScreen,
  TopUpViaBankTransferScreen,
  TopUpViaCardScreen,
  useTopUpMethods,
} from '@revolut/rwa-feature-topup'

type TopUpProps = {
  onGoBack: VoidFunction
  onPaymentSuccess: VoidFunction
}

export const TopUp: FC<TopUpProps> = ({ onGoBack, onPaymentSuccess }) => {
  const { t } = useTranslation(I18nNamespace.Common)
  const { isFeatureActive } = useFeaturesConfig()
  const { currentScreen, topUpMethodsScreenProps, topUpScreensProps } = useTopUpMethods()

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case TopUpScreen.TopUpMethods:
        return (
          <TopUpMethodsScreen
            {...topUpMethodsScreenProps}
            onTopUpSuccess={onPaymentSuccess}
            onGoBack={onGoBack}
          />
        )
      case TopUpScreen.TopUpViaCard:
        return <TopUpViaCardScreen {...topUpScreensProps} onSuccess={onPaymentSuccess} />
      case TopUpScreen.TopUpViaBankTransfer:
        return (
          <TopUpViaBankTransferScreen
            {...topUpScreensProps}
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
            onAction={onPaymentSuccess}
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
