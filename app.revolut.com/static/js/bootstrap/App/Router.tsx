import { FC, Suspense, lazy } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'

import { AuthRoute, FullAccessAuthRoute, StartPageRedirect } from '@revolut/rwa-core-auth'
import { FeatureKey } from '@revolut/rwa-core-config'
import { Url } from '@revolut/rwa-core-utils'
import { TransactionsListPage } from '@revolut/rwa-feature-transactions'
import { FullPageLoader } from '@revolut/rwa-core-components'
import { CryptoRouter } from '@revolut/rwa-feature-crypto'

import { Chat } from 'components/Chat'
import { FormLinkOpener } from 'components/Forms/FormLinkOpener'
import { useFeaturesConfig } from 'hooks'
import {
  Account,
  AccountsPage,
  AccountStatement,
  AccountsTopUp,
  DownloadTheApp,
  Error,
  Home,
  IncidentContent,
  InvalidateAccessRecovery,
  LoggedOut,
  RequestScopedToken,
  Rewards,
  Settings,
  SignIn,
  SignInOtpEmailConfirm,
  SignUp,
  SignUpTopUp,
  SotVerification,
  SowVerification,
  Start,
  TransactionDetails,
  UnsupportedLocation,
  UnsupportedLocationRedirect,
  VerifyYourIdentity,
  SuspiciousTransfer,
} from 'pages'

const CardsRouter = lazy(() =>
  import(/* webpackChunkName: "feature-cards" */ '@revolut/rwa-feature-cards').then(
    ({ Cards }) => ({ default: Cards }),
  ),
)

const HelpRouter = lazy(() => import(/* webpackChunkName: "pages-help" */ 'pages/Help'))
const OpenBanking = lazy(
  () =>
    import(
      /* webpackChunkName: "feature-open-banking" */ '@revolut/rwa-feature-open-banking'
    ),
)
const PaymentsRouter = lazy(
  () =>
    import(/* webpackChunkName: "feature-payments" */ '@revolut/rwa-feature-payments'),
)
const Travel = lazy(() => import(/* webpackChunkName: "pages-travel" */ 'pages/Travel'))
const CreditOnboarding = lazy(
  () =>
    import(/* webpackChunkName: "pages-credit-onboarding" */ 'pages/CreditOnboarding'),
)
const StocksRouter = lazy(() =>
  import(/* webpackChunkName: "feature-wealth" */ '@revolut/rwa-feature-wealth').then(
    ({ Stocks }) => ({ default: Stocks }),
  ),
)

const VaultsRouter = lazy(() =>
  import(/* webpackChunkName: "feature-vaults" */ '@revolut/rwa-feature-vaults').then(
    ({ VaultsRouter: Vaults }) => ({ default: Vaults }),
  ),
)

const DeviceManagementRouter = lazy(
  () =>
    import(
      /* webpackChunkName: "feature-device-management" */ '@revolut/rwa-feature-device-management'
    ),
)

const AppRedirects: FC = ({ children }) => (
  <UnsupportedLocationRedirect>
    <StartPageRedirect>{children}</StartPageRedirect>
  </UnsupportedLocationRedirect>
)

export const Router = () => {
  const { isFeatureActive, isFeaturesConfigReady } = useFeaturesConfig()

  if (!isFeaturesConfigReady) {
    return <FullPageLoader />
  }

  return (
    <AppRedirects>
      <Suspense fallback={null}>
        <Switch>
          <Route path={Url.UnsupportedLocation} component={UnsupportedLocation} />

          <Route path={Url.Start} component={Start} />
          <Route path={Url.SignIn} component={SignIn} exact />
          <Route path={Url.SignInOtpEmailConfirm} component={SignInOtpEmailConfirm} />
          <Route path={Url.SignUp} component={SignUp} />
          <FullAccessAuthRoute path={Url.SignUpTopUp} component={SignUpTopUp} />
          <Route path={Url.DownloadTheApp} component={DownloadTheApp} />
          <Route
            path={Url.InvalidateAccessRecovery}
            component={InvalidateAccessRecovery}
          />
          <Route path={Url.LoggedOut} component={LoggedOut} />

          <Redirect from={Url.Accounts} to={Url.Home} exact />
          <Redirect from={Url.AccountsTransactions} to={Url.Home} exact />

          <AuthRoute
            path={[Url.Accounts, Url.AccountsTransactions]}
            component={AccountsPage}
            exact
          />

          <AuthRoute path={Url.AccountStatement} component={AccountStatement} exact />

          <AuthRoute path={[Url.Home, Url.HomeTab]} component={Home} exact />

          <FullAccessAuthRoute path={Url.AccountsTopUp} component={AccountsTopUp} />
          <AuthRoute
            path={[Url.Account, Url.AccountTransactions, Url.AccountDetails]}
            component={Account}
          />
          <Route path={Url.Cards} component={CardsRouter} />

          <AuthRoute path={Url.TransactionsList} component={TransactionsListPage} />

          <AuthRoute path={Url.TransactionDetails} component={TransactionDetails} />
          <Route path={Url.VerifyYourIdentity} component={VerifyYourIdentity} />
          <Route path={Url.RequestScopedToken} component={RequestScopedToken} />

          <Route path={Url.IncidentContent} component={IncidentContent} />

          <FullAccessAuthRoute path={Url.OpenBanking} component={OpenBanking} />

          <FullAccessAuthRoute path={Url.Form} component={FormLinkOpener} />

          {isFeatureActive(FeatureKey.Crypto) && (
            <Route path={Url.Crypto} component={CryptoRouter} />
          )}

          {isFeatureActive(FeatureKey.Stocks) && (
            <Route path={Url.Wealth} component={StocksRouter} />
          )}

          {isFeatureActive(FeatureKey.Vaults) && (
            <Route path={Url.Vaults} component={VaultsRouter} />
          )}

          {isFeatureActive(FeatureKey.Rewards) && (
            <Route path={Url.RewardsHome} component={Rewards} />
          )}

          {(isFeatureActive(FeatureKey.Travel) ||
            isFeatureActive(FeatureKey.TravelBooking)) && (
            <Route path={Url.TravelHome} component={Travel} />
          )}

          {isFeatureActive(FeatureKey.CreditOnboarding) && (
            <Route path={Url.CreditOnboardingHome} component={CreditOnboarding} />
          )}

          {isFeatureActive(FeatureKey.AllowUserSettings) && (
            <FullAccessAuthRoute path={Url.Settings} component={Settings} />
          )}

          <Route path={Url.Help} component={HelpRouter} />

          {isFeatureActive(FeatureKey.ShowSowVerificationFlow) && (
            <FullAccessAuthRoute path={Url.SowVerification} component={SowVerification} />
          )}

          {isFeatureActive(FeatureKey.SuspiciousTransfer) && (
            <FullAccessAuthRoute
              path={Url.SuspiciousTransfer}
              component={SuspiciousTransfer}
            />
          )}

          {isFeatureActive(FeatureKey.ShowSotVerificationFlow) && (
            <FullAccessAuthRoute path={Url.SotVerification} component={SotVerification} />
          )}

          {isFeatureActive(FeatureKey.AllowPayments) && (
            <FullAccessAuthRoute path={Url.Payments} component={PaymentsRouter} />
          )}

          <FullAccessAuthRoute
            path={Url.DeviceManagement}
            component={DeviceManagementRouter}
          />

          <Route path={Url.Error} component={Error} />

          {/* Page not found */}
          <Redirect to={Url.Root} />
        </Switch>

        <Route
          path={[
            Url.Account,
            Url.Accounts,
            Url.Cards,
            Url.Help,
            Url.Home,
            Url.RewardsHome,
            Url.Settings,
            Url.TransactionDetails,
          ]}
          component={Chat}
        />
      </Suspense>
    </AppRedirects>
  )
}
