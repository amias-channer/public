import { FC, ReactNode, Suspense, useMemo, useState, lazy } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory, useParams } from 'react-router-dom'
import {
  Box,
  Layout,
  ProductWidgetSkeleton,
  ThemeProvider,
  UnifiedTheme,
} from '@revolut/ui-kit'

import { getHomeUrl } from '@revolut/rwa-core-utils'
import { FeatureKey } from '@revolut/rwa-core-config'
import { Navigation, Header } from '@revolut/rwa-core-navigation'
import { CryptoHomePage } from '@revolut/rwa-feature-crypto'

import { IncidentBanners } from 'components'
import { useFeaturesConfig } from 'hooks'

import { HomeProductWidget, TransactionDetailsOnSide, WelcomeStory } from './AccountsTab'
import { I18N_NAMESPACE } from './constants'
import { HomeTab, Tabs } from './Tabs'

const CardsOverview = lazy(() =>
  import(/* webpackChunkName: "feature-cards" */ '@revolut/rwa-feature-cards').then(
    (module) => ({ default: module.CardsOverview }),
  ),
)

const CardSettings = lazy(() =>
  import(/* webpackChunkName: "feature-cards" */ '@revolut/rwa-feature-cards').then(
    (module) => ({ default: module.CardSettings }),
  ),
)

const StocksHome = lazy(() =>
  import(/* webpackChunkName: "feature-wealth" */ '@revolut/rwa-feature-wealth').then(
    (module) => ({ default: module.StocksHome }),
  ),
)

const VaultsHome = lazy(() =>
  import(/* webpackChunkName: "feature-vaults" */ '@revolut/rwa-feature-vaults').then(
    (module) => ({ default: module.VaultsHome }),
  ),
)

const TEST_ID_HEADER = 'homePageHeader'

const renderContentAndSide = (tab: HomeTab): { content: ReactNode; side?: ReactNode } => {
  switch (tab) {
    case HomeTab.Accounts:
      return {
        content: <HomeProductWidget />,
        side: <TransactionDetailsOnSide />,
      }
    case HomeTab.Cards:
      return {
        content: <CardsOverview />,
        side: <CardSettings />,
      }
    case HomeTab.Stocks:
      return {
        content: (
          <Suspense fallback={<ProductWidgetSkeleton />}>
            <StocksHome />
          </Suspense>
        ),
      }
    case HomeTab.Crypto:
      return {
        content: <CryptoHomePage />,
      }
    case HomeTab.Vaults:
      return {
        content: <VaultsHome />,
      }
    default:
      throw new Error(`Tab ${tab} not reachable. It needs to be handled.`)
  }
}

export const Home: FC = () => {
  const { t } = useTranslation(I18N_NAMESPACE)
  const { isFeatureActive } = useFeaturesConfig()
  const history = useHistory()
  const { tab: initialTab } = useParams<{ tab?: HomeTab }>()

  const [activeTab, setActiveTab] = useState<HomeTab>(initialTab ?? HomeTab.Accounts)
  const { content, side } = useMemo(() => renderContentAndSide(activeTab), [activeTab])

  const handleTabChange = (tab: HomeTab) => {
    setActiveTab(tab)
    history.push(getHomeUrl({ tab, queryParams: {} }))
  }

  return (
    <ThemeProvider theme={UnifiedTheme}>
      <Layout>
        <Layout.Menu>
          <Navigation />
        </Layout.Menu>

        <Layout.Main>
          <Header title={t('home')} data-testid={TEST_ID_HEADER} />

          <Tabs activeTab={activeTab} onChange={handleTabChange} />

          <Box mb="s-16" />

          {isFeatureActive(FeatureKey.ShowHomeBanners) && (
            <IncidentBanners showNewBanner />
          )}

          <WelcomeStory />

          {content}
        </Layout.Main>

        <Layout.Side>{side}</Layout.Side>
      </Layout>
    </ThemeProvider>
  )
}
