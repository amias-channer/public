import { FC } from 'react'
import { Switch } from 'react-router'
import { ThemeProvider, UnifiedTheme } from '@revolut/ui-kit'

import { UserFeatureName } from '@revolut/rwa-core-config'
import { useCheckUserFeatureEnabled } from '@revolut/rwa-core-api'
import { FullAccessAuthRoute } from '@revolut/rwa-core-auth'
import { Url } from '@revolut/rwa-core-utils'

import { CryptoExchangeProvider, CryptoProvider } from '../providers'
import { CryptoDetailsPage } from './CryptoDetailsPage'
import { CryptoExchangeConfirmationPage } from './CryptoExchangeConfirmationPage'
import { CryptoRecurringOrderDetails } from './CryptoRecurringOrderDetails'
import { CryptoTransactionDetails } from './CryptoTransactionDetails'
import { CryptoInvestPage } from './CryptoInvestPage'
import { CryptoDisclosurePage } from './CryptoDisclosurePage'
import { CryptoStatement } from './CryptoStatement'
import { CryptoStatsPage } from './CryptoStatsPage'
import { CryptoExchangePage } from './CryptoExchangePage'
import { CryptoHoldingsPage } from './CryptoHoldingsPage'
import { CryptoTopMoversPage } from './CryptoTopMoversPage'
import { CryptoPopularAssetsPage } from './CryptoPopularAssetsPage'

export const CryptoRouter: FC = () => {
  const isRecurringBuyEnabled = useCheckUserFeatureEnabled(
    UserFeatureName.CryptoRecurringBuy,
  )
  return (
    <ThemeProvider theme={UnifiedTheme}>
      <CryptoProvider>
        <CryptoExchangeProvider>
          <Switch>
            <FullAccessAuthRoute
              exact
              path={Url.CryptoDisclosure}
              component={CryptoDisclosurePage}
            />
            <FullAccessAuthRoute
              exact
              path={Url.CryptoInvest}
              component={CryptoInvestPage}
            />
            <FullAccessAuthRoute
              exact
              path={Url.CryptoHoldings}
              component={CryptoHoldingsPage}
            />
            <FullAccessAuthRoute
              exact
              path={Url.CryptoTopMovers}
              component={CryptoTopMoversPage}
            />
            <FullAccessAuthRoute
              exact
              path={Url.CryptoPopularAssets}
              component={CryptoPopularAssetsPage}
            />
            <FullAccessAuthRoute
              exact
              path={Url.CryptoStatement}
              component={CryptoStatement}
            />
            <FullAccessAuthRoute
              exact
              path={[
                Url.CryptoDetailsOverview,
                Url.CryptoRecurringOrders,
                Url.CryptoTransactions,
              ]}
              component={CryptoDetailsPage}
            />
            <FullAccessAuthRoute
              exact
              path={Url.CryptoStats}
              component={CryptoStatsPage}
            />
            <FullAccessAuthRoute
              exact
              path={Url.CryptoExchange}
              component={CryptoExchangePage}
            />
            <FullAccessAuthRoute
              exact
              path={Url.CryptoExchangeConfirmation}
              component={CryptoExchangeConfirmationPage}
            />
            {isRecurringBuyEnabled && (
              <FullAccessAuthRoute
                exact
                path={Url.CryptoRecurringOrderDetails}
                component={CryptoRecurringOrderDetails}
              />
            )}
            <FullAccessAuthRoute
              exact
              path={Url.CryptoTransactionDetails}
              component={CryptoTransactionDetails}
            />
          </Switch>
        </CryptoExchangeProvider>
      </CryptoProvider>
    </ThemeProvider>
  )
}
