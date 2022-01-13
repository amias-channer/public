import 'normalize.css'
import ReactDOM from 'react-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { BrowserRouter } from 'react-router-dom'
import { BreakpointsProvider, ThemeProvider } from '@revolut/ui-kit'
import * as Sentry from '@sentry/react'

import { getConfigValue, ConfigKey } from '@revolut/rwa-core-config'
import { theme } from '@revolut/rwa-core-styles'
import { queryCache, getErrorUrl, browser } from '@revolut/rwa-core-utils'

import { App } from './App'

const queryClient = new QueryClient({
  queryCache,
  defaultOptions: {
    queries: {
      retry: getConfigValue(ConfigKey.ReactQueryRetry),
    },
  },
})

export const renderApp = () => {
  const handleOnError = (_error: Error, _componentStack: string, eventId: string) => {
    const navigateToErrorPage = () => browser.navigateTo(getErrorUrl(eventId))

    Sentry.flush().then(navigateToErrorPage, navigateToErrorPage)
  }

  ReactDOM.render(
    <Sentry.ErrorBoundary onError={handleOnError}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <BreakpointsProvider>
              <App />
            </BreakpointsProvider>
          </BrowserRouter>
        </ThemeProvider>
      </QueryClientProvider>
    </Sentry.ErrorBoundary>,
    document.getElementById('root'),
  )
}
