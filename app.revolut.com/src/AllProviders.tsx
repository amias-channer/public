import React, { FC, Fragment } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { ThemeProvider, CompatTheme } from '@revolut/ui-kit'
import { IntlProvider, IntlConfig } from 'react-intl'
import { QueryClient, QueryClientProvider } from 'react-query'

import { store } from './redux/stores/mainStore'
import {
  SettingsProvider,
  SettingsState,
  ReviewStatusProvider,
  ChatModeProvider,
  StatusBannersProvider,
} from './providers'
import { StatusBannerType } from './api/types'

const queryClient = new QueryClient()

type Props = {
  locale: string
  messages: IntlConfig['messages']
  settings: SettingsState
  reviewStatus: {
    isUnderReview: boolean
    hasPendingRequests: boolean
  }
  statusBanners: StatusBannerType[]
}

export const AllProviders: FC<Props> = ({
  locale,
  messages,
  settings,
  reviewStatus,
  statusBanners,
  children,
}) => (
  <ReduxProvider store={store}>
    <ThemeProvider theme={CompatTheme}>
      <QueryClientProvider client={queryClient}>
        <IntlProvider
          locale={locale}
          messages={messages}
          textComponent={Fragment}
          onError={
            () => {} /* intentionally omit console.error calls during tests */
          }
        >
          <ChatModeProvider>
            <SettingsProvider settings={settings}>
              <StatusBannersProvider statusBanners={statusBanners}>
                <ReviewStatusProvider reviewStatus={reviewStatus}>
                  {children}
                </ReviewStatusProvider>
              </StatusBannersProvider>
            </SettingsProvider>
          </ChatModeProvider>
        </IntlProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </ReduxProvider>
)
