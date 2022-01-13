import { IS_MOCKED_API, IS_CYPRESS } from '@revolut/rwa-core-config'
import { AxiosSecurity } from '@revolut/rwa-core-utils'

const MOCK_USERNAME = 'testuser'
const MOCK_PASSWORD = 'testpassword'

export const setupMockAuth = () => {
  if (!IS_MOCKED_API) {
    return
  }

  // Please see:
  // https://docs.cypress.io/faq/questions/using-cypress-faq#Is-there-any-way-to-detect-if-my-app-is-running-under-Cypress
  if (window.Cypress || IS_CYPRESS) {
    console.warn('Running under Cypress, auth mocking will be skipped')

    return
  }

  console.warn('Mocking auth: username=%s, password=%s', MOCK_USERNAME, MOCK_PASSWORD)

  AxiosSecurity.saveUsernameAndPasswordToStorage(MOCK_USERNAME, MOCK_PASSWORD)
}
