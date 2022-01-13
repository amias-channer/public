import { FC, ReactNode } from 'react'
import { Layout, ThemeProvider, UnifiedTheme } from '@revolut/ui-kit'

import { Header, Navigation } from '@revolut/rwa-core-navigation'

import { PageLayoutProps } from '../PageLayout'

type PageWithSidebarLayoutProps = PageLayoutProps & {
  side?: ReactNode
  noLayout?: boolean
}

export const PageWithSidebarLayout: FC<PageWithSidebarLayoutProps> = ({
  children,
  title,
  side,
  noHeader,
  noLayout,
}) => {
  return (
    <ThemeProvider theme={UnifiedTheme}>
      <Layout>
        <Layout.Menu>
          <Navigation />
        </Layout.Menu>
        {!noLayout ? (
          <Layout.Main>
            {!noHeader && <Header title={title} />}
            {children}
          </Layout.Main>
        ) : (
          children
        )}
        {side && <Layout.Side>{side}</Layout.Side>}
      </Layout>
    </ThemeProvider>
  )
}
