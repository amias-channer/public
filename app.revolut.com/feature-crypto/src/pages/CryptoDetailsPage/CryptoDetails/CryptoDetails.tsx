import { useContext, VFC } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory, useParams, Route, Switch, generatePath } from 'react-router-dom'

import { chain, Header, Layout, MoreBar, TabBar, Text } from '@revolut/ui-kit'

import * as Icons from '@revolut/icons'

import {
  ConfigKey,
  CurrencyProperties,
  getConfigValue,
  UserFeatureName,
} from '@revolut/rwa-core-config'
import {
  browser,
  getHomeUrl,
  Url,
  CryptoDetailsSourceOption,
  getCryptoDetailsUrl,
  I18nNamespace,
} from '@revolut/rwa-core-utils'
import { useCheckUserFeatureEnabled } from '@revolut/rwa-core-api'

import { CryptoAvatar } from '../../../components'
import { CryptoContext } from '../../../providers'
import { useCryptoHoldings } from '../../../hooks'
import { CryptoExchangeMethod } from '../../../types'
import { getCryptoExchangeMethodUrl } from '../../../utils'
import { I18N_NAMESPACE } from '../constants'

import { CryptoDetailsOverview } from './CryptoDetailsOverview'
import { CryptoRecurringOrders } from './CryptoRecurringOrders'
import { CryptoTransactions } from './CryptoTransactions'

type UrlParams = {
  cryptoCode: string
}

type UrlQuery = {
  source: CryptoDetailsSourceOption
}

const getBackButtonUrl = (sourcePageQuery: CryptoDetailsSourceOption) => {
  switch (sourcePageQuery) {
    case 'populaCryptoPage':
      return Url.CryptoPopularAssets
    case 'holdingsPage':
      return Url.CryptoHoldings
    case 'topMoversPage':
      return Url.CryptoTopMovers
    case 'investPage':
      return Url.CryptoInvest
    default:
      return getHomeUrl({ tab: 'crypto' })
  }
}

export const CryptoDetails: VFC = () => {
  const history = useHistory()
  const { cryptoCode } = useParams<UrlParams>()
  const { source: sourcePageQuery } = browser.getQueryParams<UrlQuery>()

  const isRecurringBuyEnabled = useCheckUserFeatureEnabled(
    UserFeatureName.CryptoRecurringBuy,
  )

  const { t } = useTranslation([I18N_NAMESPACE, I18nNamespace.Common])

  const { targetCurrency } = useContext(CryptoContext)

  const { getHolding } = useCryptoHoldings(targetCurrency)

  const cryptoCurrenciesInfo = getConfigValue(ConfigKey.CryptoCurrencies)

  const holdingData = getHolding(cryptoCode)

  const cryptoInfo: CurrencyProperties = cryptoCurrenciesInfo[cryptoCode]

  const handleNavigateToExchange = (exchangeMethod: CryptoExchangeMethod) => {
    history.push(getCryptoExchangeMethodUrl(cryptoCode, exchangeMethod))
  }

  const onBuyClick = () => {
    handleNavigateToExchange(CryptoExchangeMethod.Buy)
  }

  const onSellClick = () => {
    handleNavigateToExchange(CryptoExchangeMethod.Sell)
  }

  const onBackClick = () => {
    history.push(getBackButtonUrl(sourcePageQuery))
  }

  const navigateToStatement = () => {
    history.push(
      generatePath(Url.CryptoStatement, {
        cryptoCode,
      }),
    )
  }

  return (
    <Layout.Main>
      <Header variant="item">
        <Header.BackButton onClick={onBackClick} />
        <Header.Title>{cryptoInfo.currency}</Header.Title>

        <Header.Subtitle>
          {chain([
            cryptoCode,
            holdingData.value ? (
              <Text color="foreground">{t('PocketState.active')}</Text>
            ) : undefined,
          ])}
        </Header.Subtitle>

        <Header.Avatar>
          <CryptoAvatar
            avatarProps={{
              size: 56,
            }}
            cryptoCode={cryptoCode}
          />
        </Header.Avatar>
        <Header.Bar>
          <MoreBar>
            <MoreBar.Action variant="primary" useIcon={Icons.Plus} onClick={onBuyClick}>
              {t('ActionButton.buy')}
            </MoreBar.Action>
            <MoreBar.Action useIcon={Icons.Minus} onClick={onSellClick}>
              {t('ActionButton.sell')}
            </MoreBar.Action>
            {holdingData.value && (
              <MoreBar.Action useIcon={Icons.Statement} onClick={navigateToStatement}>
                {t(`${I18nNamespace.Common}:statement`)}
              </MoreBar.Action>
            )}
          </MoreBar>
        </Header.Bar>
        <Header.Sticky>
          <TabBar variant="navigation">
            <TabBar.Item
              to={getCryptoDetailsUrl(cryptoCode, {
                tab: 'overview',
                source: sourcePageQuery,
              })}
            >
              {t('Tabs.overviewTab.title')}
            </TabBar.Item>
            {isRecurringBuyEnabled && (
              <TabBar.Item
                to={getCryptoDetailsUrl(cryptoCode, {
                  tab: 'recurring',
                  source: sourcePageQuery,
                })}
              >
                {t('Tabs.recurringOrdersTab.title')}
              </TabBar.Item>
            )}
            <TabBar.Item
              to={getCryptoDetailsUrl(cryptoCode, {
                tab: 'transactions',
                source: sourcePageQuery,
              })}
            >
              {t('Tabs.transactions.title')}
            </TabBar.Item>
          </TabBar>
        </Header.Sticky>
      </Header>
      <Switch>
        <Route exact path={Url.CryptoDetailsOverview} component={CryptoDetailsOverview} />
        {isRecurringBuyEnabled && (
          <Route
            exact
            path={Url.CryptoRecurringOrders}
            component={CryptoRecurringOrders}
          />
        )}
        <Route exact path={Url.CryptoTransactions} component={CryptoTransactions} />
      </Switch>
    </Layout.Main>
  )
}
