import { setupI18n } from '@revolut/rwa-core-i18n'

import {
  renderApp,
  setupAxios,
  setupCypressConfig,
  setupDeviceId,
  setupErrorHandler,
  setupSentry,
  setupAnalytics,
  setupMockAuth,
} from './bootstrap'

setupDeviceId()
setupMockAuth()
setupSentry()
setupAxios()
setupErrorHandler()

setupI18n().then(() => {
  setupAnalytics()

  renderApp()
})

if (window.Cypress) {
  setupCypressConfig()
}
