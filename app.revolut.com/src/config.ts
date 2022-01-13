/* eslint-disable import/no-default-export */
export default {
  REQUEST_HEADERS: {
    apiType: 'chat',
    headers: {
      'X-Chat-Version': '3.0.0',
      'Content-Type': 'application/json',
    },
    baseURL: '/chat',
  },
  VERSION: '3.0.0',
  PRODUCTION_WS: 'wss://chat.revolut.com',
  TEST_WS: 'wss://chat.revolut.codes',
  ENDPOINTS: {
    LOCAL: 'localhost',
    TEST: 'chat.revolut.codes',
    PROD: 'chat.revolut.com',
  },
}
