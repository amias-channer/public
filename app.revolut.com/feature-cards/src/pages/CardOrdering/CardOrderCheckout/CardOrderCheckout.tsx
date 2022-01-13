import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Redirect, useHistory } from 'react-router-dom'
import { ThemeProvider, UnifiedTheme } from '@revolut/ui-kit'

import { AccountDetailsTab, FullPageLoader } from '@revolut/rwa-core-components'
import {
  I18nNamespace,
  Url,
  useNavigateToErrorPage,
  getCardDetailsUrl,
} from '@revolut/rwa-core-utils'
import {
  TopUpMethodsScreen,
  TopUpViaCardScreen,
  TopUpViaBankTransferScreen,
  TopUpScreen,
  TopUpProvider,
  useTopUpMethods,
} from '@revolut/rwa-feature-topup'

import { CARDS_I18N_NAMESPACE, getCardsOverviewUrl } from '../../../helpers'
import { useCancelCardCheckout } from '../../../hooks'

import {
  useFormatCheckoutItems,
  useGetCardCheckout,
  useGetCheckoutItems,
  useInvalidateCardOrderCheckoutQueries,
} from './hooks'
import { getFullCheckoutAmount } from './utils'

export const CardOrderCheckout: FC = () => {
  const { t } = useTranslation([CARDS_I18N_NAMESPACE, I18nNamespace.Common])
  const history = useHistory()
  const navigateToErrorPage = useNavigateToErrorPage()

  const { cancelCardCheckout } = useCancelCardCheckout()
  const invalidateQueries = useInvalidateCardOrderCheckoutQueries()
  const { cardCheckout, isPendingCheckoutsFetching } = useGetCardCheckout()
  const { currentScreen, topUpMethodsScreenProps, topUpScreensProps } = useTopUpMethods()
  const checkoutItems = useGetCheckoutItems(cardCheckout)
  const formattedCheckoutItems = useFormatCheckoutItems(checkoutItems)

  if (isPendingCheckoutsFetching) {
    return <FullPageLoader />
  }

  if (!cardCheckout) {
    return <Redirect to={Url.CardsOverview} />
  }

  const checkoutCardId = cardCheckout.card.id

  const handleTopUpMethodGoBack = async () => {
    await cancelCardCheckout(checkoutCardId, {
      onSuccess: () => {
        history.goBack()
      },
      onError: () => {
        navigateToErrorPage('Can not cancel card checkout')
      },
    })
  }

  const goToCardDetails = () => {
    history.push(getCardDetailsUrl(checkoutCardId))
  }

  const handleBankTransferAction = () => {
    history.push(getCardsOverviewUrl())
  }

  const handleTopUpSuccess = async () => {
    await invalidateQueries()
    goToCardDetails()
  }

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case TopUpScreen.TopUpMethods:
        return (
          <TopUpMethodsScreen
            {...topUpMethodsScreenProps}
            title={t('CardOrdering.CardOrderCheckout.title')}
            checkoutAmount={getFullCheckoutAmount(checkoutItems)}
            checkoutItems={formattedCheckoutItems}
            onTopUpSuccess={handleTopUpSuccess}
            onGoBack={handleTopUpMethodGoBack}
          />
        )
      case TopUpScreen.TopUpViaCard:
        return (
          <TopUpViaCardScreen {...topUpScreensProps} onSuccess={handleTopUpSuccess} />
        )
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
            onAction={handleBankTransferAction}
          />
        )
      default:
        throw new Error(`Screen ${currentScreen} not reachable. It needs to be handled.`)
    }
  }

  return (
    <ThemeProvider theme={UnifiedTheme}>
      <TopUpProvider>{renderCurrentScreen()}</TopUpProvider>
    </ThemeProvider>
  )
}
