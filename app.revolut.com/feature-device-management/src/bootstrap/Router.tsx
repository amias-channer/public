import { VFC } from 'react'

import { Layout, ThemeProvider, UnifiedTheme } from '@revolut/ui-kit'
import { Navigation } from '@revolut/rwa-core-navigation'

import { DeviceCard, DeviceList } from '../components'
import { PopupProvider } from '../providers'
import { usePopup } from '../hooks'

export const Router: VFC = () => (
  <ThemeProvider theme={UnifiedTheme}>
    <PopupProvider>
      <DeviceManagement />
    </PopupProvider>
  </ThemeProvider>
)

const DeviceManagement: VFC = () => {
  const { popup } = usePopup()

  return (
    <Layout>
      <Layout.Menu>
        <Navigation />
      </Layout.Menu>
      <Layout.Main>
        <DeviceCard />
        <DeviceList />
      </Layout.Main>
      {popup}
    </Layout>
  )
}
