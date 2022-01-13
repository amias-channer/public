import { FC } from 'react'
import { Layout, ThemeProvider, UnifiedTheme } from '@revolut/ui-kit'

import { Navigation } from '@revolut/rwa-core-navigation'
import { AbsoluteLoader } from '@revolut/rwa-core-components'

type Props = {
  isLoading?: boolean
}

export const BACK_BUTTON_TEST_ID = 'backbutton-test-id'

export const RewardsLayout: FC<Props> = ({ children, isLoading }) => (
  <ThemeProvider theme={UnifiedTheme}>
    <Layout>
      <Layout.Menu>
        <Navigation />
      </Layout.Menu>
      {isLoading ? <AbsoluteLoader /> : <Layout.Main>{children}</Layout.Main>}
    </Layout>
  </ThemeProvider>
)
