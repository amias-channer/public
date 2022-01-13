import { FC, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { useHistory } from 'react-router-dom'
import * as Sentry from '@sentry/react'

import { trackEvent, CommonTrackingEvent } from '@revolut/rwa-core-analytics'
import { AuthProvider } from '@revolut/rwa-core-auth'
import { GoogleAnalytics } from '@revolut/rwa-core-components'
import {
  IS_CYPRESS,
  ConfigKey,
  getConfigValue,
  isDevelopmentEnv,
} from '@revolut/rwa-core-config'
import { LocaleProvider, loadLocaleData } from '@revolut/rwa-core-i18n'
import { GlobalStyle } from '@revolut/rwa-core-styles'
import { buildSentryContext, getCurrentLocale, SentryTag } from '@revolut/rwa-core-utils'
import { TransactionsScrollingContextProvider } from '@revolut/rwa-feature-transactions'
import { StatementsProvider } from '@revolut/rwa-feature-statements'
import { prefetchCommonConfig } from '@revolut/rwa-core-api'

import {
  CookiesBanner,
  CookiesBannerProvider,
  GlobalNotification,
  RequiredFetches,
} from 'components'
import { ChatProvider } from 'components/Chat/ChatProvider'
import { FormsProvider } from 'components/Forms'
import { useCookiesPreferences } from 'hooks'

import { Router } from './Router'

const AppWrappers: FC = ({ children }) => (
  <AuthProvider>
    <LocaleProvider>
      <ChatProvider>
        <FormsProvider>
          <TransactionsScrollingContextProvider>
            <CookiesBannerProvider>
              <StatementsProvider>
                <RequiredFetches>
                  <GlobalNotification>{children}</GlobalNotification>
                </RequiredFetches>
              </StatementsProvider>
            </CookiesBannerProvider>
          </TransactionsScrollingContextProvider>
        </FormsProvider>
      </ChatProvider>
    </LocaleProvider>
  </AuthProvider>
)

export const App = () => {
  const { t } = useTranslation('pages.common')
  const queryClient = useQueryClient()
  const { cookiesPreferences } = useCookiesPreferences()

  const history = useHistory()

  const gaId =
    cookiesPreferences.analyticsTargetingEnabled &&
    getConfigValue(ConfigKey.GoogleAnalyticsId)

  useEffect(() => {
    loadLocaleData(getCurrentLocale()).catch((e) =>
      Sentry.captureException(e, {
        tags: { [SentryTag.Context]: buildSentryContext(['app', 'load current locale']) },
      }),
    )
  }, [])

  useEffect(() => {
    history.listen(({ pathname, search }) => {
      trackEvent(CommonTrackingEvent.locationChanged, { url: pathname + search })
    })
  }, [history])

  prefetchCommonConfig(queryClient)

  return (
    <>
      {gaId && <GoogleAnalytics id={gaId} />}

      <GlobalStyle />

      <Helmet>
        <title>{t('meta.title')} | Revolut</title>
        <meta name="description" content={t('meta.description')} />
      </Helmet>

      <AppWrappers>
        <CookiesBanner />
        <Router />
      </AppWrappers>

      {isDevelopmentEnv() && !IS_CYPRESS && <ReactQueryDevtools initialIsOpen={false} />}
    </>
  )
}
