import { VFC, lazy } from 'react'

import { Layout, ThemeProvider, UnifiedTheme } from '@revolut/ui-kit'
import { Navigation } from '@revolut/rwa-core-navigation'

const Router = lazy(
  () =>
    import(
      /* webpackChunkName: "feature-suspicious-transfer" */ '@revolut/rwa-feature-suspicious-transfer'
    ),
)

export const SuspiciousTransfer: VFC = () => {
  return (
    <ThemeProvider theme={UnifiedTheme}>
      <Layout>
        <Layout.Menu>
          <Navigation />
        </Layout.Menu>
        <Router />
      </Layout>
    </ThemeProvider>
  )
}
