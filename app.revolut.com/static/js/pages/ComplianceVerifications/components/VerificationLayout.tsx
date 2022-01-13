import { FC } from 'react'
import { Layout, ThemeProvider, UnifiedTheme } from '@revolut/ui-kit'

import { Navigation } from '@revolut/rwa-core-navigation'

export const VerificationLayout: FC = ({ children }) => {
  return (
    <ThemeProvider theme={UnifiedTheme}>
      <Layout>
        <Layout.Menu>
          <Navigation />
        </Layout.Menu>
        {children}
      </Layout>
    </ThemeProvider>
  )
}
