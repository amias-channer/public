import { IS_CYPRESS, Env } from '../env'
import blacklistedCountries from './json/blacklistedCountries.json'
import blacklistedRegions from './json/blacklistedRegions.json'
import countries from './json/countries.json'
import countriesWithoutRegion from './json/countriesWithoutRegion.json'
import creditAllowedCountries from './json/creditAllowedCountries.json'
import signupFlowElements from './json/signupFlowElements.json'
import supportedLocales from './json/supportedLocales.json'

import { currenciesStorageInstance } from './utils/currencies'

export enum ConfigKey {
  BlacklistedCountries = 'BLACKLISTED_COUNTRIES',
  BlacklistedRegions = 'BLACKLISTED_REGIONS',
  BrowserApplication = 'BROWSER_APPLICATION',
  CdnUrl = 'CDN_URL',
  CheckoutComApi = 'CHECKOUT_COM_API',
  ClientVersion = 'CLIENT_VERSION',
  Commodities = 'COMMODITIES',
  CookieAuth = 'COOKIE_AUTH',
  CookiesPolicyLink = 'COOKIES_POLICY_LINK',
  Countries = 'COUNTRIES',
  CountriesWithoutRegion = 'COUNTRIES_WITHOUT_REGION',
  CreditAllowedCountries = 'CREDIT_ALLOWED_COUNTRIES',
  // Must be synced with Android
  // https://revolut.atlassian.net/wiki/spaces/RET/pages/2123633289/Sync+crypto+currencies+with+Android+app
  CryptoCurrencies = 'CRYPTO_CURRENCIES',
  CryptoTermsUrl = 'CRYPTO_TERMS_LINK',
  Currencies = 'CURRENCIES',
  DeviceIdVersion = 'DEVICE_ID_VERSION',
  FallbackLocale = 'FALLBACK_LOCALE',
  ForgotMyPasscodeUrl = 'FORGOT_MY_PASSCODE_URL',
  GoogleAnalyticsId = 'GOOGLE_ANALYTICS_ID',
  GoogleMapsAPIKey = 'GOOGLE_MAPS_API_KEY',
  GoogleMapsJavaScriptAPIKey = 'GOOGLE_MAPS_JAVASCRIPT_API_KEY',
  GooglePayApiUrl = 'GOOGLE_PAY_API_URL',
  GooglePayMerchantId = 'GOOGLE_PAY_MERCHANT_ID',
  InactivityPeriodSeconds = 'INACTIVITY_PERIOD_SECONDS',
  LogoutAfterInactivityMinutes = 'LOGOUT_AFTER_INACTIVITY_MINUTES',
  MallApi = 'MALL_API',
  ReactQueryRetry = 'REACT_QUERY_RETRY',
  RevolutApi = 'REVOLUT_API',
  RevolutWebsiteGetTheAppUrl = 'REVOLUT_WEBSITE_GET_THE_APP_URL',
  RevolutWebsiteUrl = 'REVOLUT_WEBSITE_URL',
  SentryDsn = 'SENTRY_DSN',
  ShopperStoreUrl = 'SHOPPER_STORE_URL',
  SignOutOnUnauthorizedError = 'SIGN_OUT_ON_UNAUTHORIZED_ERROR',
  SignupFlowElements = 'SIGN_UP_FLOW_ELEMENTS',
  SupportedLocales = 'SUPPORTED_LOCALES',
  WorldpayWidgetUrl = 'WORLDPAY_WIDGET_URL',
  ChatBaseUrl = 'CHAT_BASE_URL',
}

export const DEFAULT_ENV = Symbol.for('default')

export type Config = {
  [K in Env | typeof DEFAULT_ENV]: { [T in ConfigKey]?: any }
}

export const CONFIG: Config = {
  [DEFAULT_ENV]: {
    [ConfigKey.BlacklistedCountries]: blacklistedCountries,
    [ConfigKey.BlacklistedRegions]: blacklistedRegions,
    [ConfigKey.BrowserApplication]: 'WEB_CLIENT',
    [ConfigKey.CdnUrl]: 'https://assets.revolut.com',
    [ConfigKey.CheckoutComApi]: 'https://api.checkout.com',
    [ConfigKey.ClientVersion]: '100.0',
    [ConfigKey.CookieAuth]: false,
    [ConfigKey.CookiesPolicyLink]: 'https://www.revolut.com/legal/cookies-policy',
    [ConfigKey.Countries]: countries,
    [ConfigKey.CountriesWithoutRegion]: countriesWithoutRegion,
    [ConfigKey.CryptoTermsUrl]: 'https://www.revolut.com/legal/cryptocurrency-terms',
    [ConfigKey.CreditAllowedCountries]: creditAllowedCountries,
    [ConfigKey.ChatBaseUrl]: 'https://chat.revolut.com',
    [ConfigKey.DeviceIdVersion]: 3,
    [ConfigKey.FallbackLocale]: 'en',
    [ConfigKey.ForgotMyPasscodeUrl]:
      'https://www.revolut.com/help/profile-plan/profile-settings/i-forgot-my-passcode',
    [ConfigKey.GoogleMapsAPIKey]: 'AIzaSyAoFqnKi3R836FVaQMNMOXeKJYlnENy4HM',
    [ConfigKey.GoogleMapsJavaScriptAPIKey]: 'AIzaSyBmFv7cf_IOIupX_HR76nj_v0XeN2anNWk',
    [ConfigKey.GooglePayApiUrl]: 'https://pay.google.com/gp/p/js/pay.js',
    // The same ID is used for Revolut Payments.
    // Please see: https://bitbucket.org/revolut/infra-apps-conf/src/705b32799d4d9ff0b3d56167aa21259cfd2c1d8a/revolut-prod-apps/group_vars/retail-payments-all/config.yml#lines-278:280
    [ConfigKey.GooglePayMerchantId]: 'BCR2DN6TR7C5DPD3',
    [ConfigKey.InactivityPeriodSeconds]: 5,
    [ConfigKey.LogoutAfterInactivityMinutes]: 5,
    [ConfigKey.MallApi]: '/api/mall',
    [ConfigKey.ReactQueryRetry]: 1,
    [ConfigKey.SignOutOnUnauthorizedError]: false,
    [ConfigKey.RevolutApi]: '/api',
    [ConfigKey.RevolutWebsiteGetTheAppUrl]: 'https://www.revolut.com/gettheapp',
    [ConfigKey.RevolutWebsiteUrl]: 'https://www.revolut.com',
    [ConfigKey.ShopperStoreUrl]:
      'https://chrome.google.com/webstore/detail/revolut-shopper/hdlehfdjcalidklijenibmpcdgjfmafn',
    [ConfigKey.SignupFlowElements]: signupFlowElements,
    [ConfigKey.SupportedLocales]: supportedLocales,
    [ConfigKey.WorldpayWidgetUrl]:
      'https://payments.worldpay.com/resources/cse/js/worldpay-cse-1.latest.min.js',

    get [ConfigKey.Commodities]() {
      return currenciesStorageInstance.commodity
    },

    get [ConfigKey.CryptoCurrencies]() {
      return currenciesStorageInstance.crypto
    },

    get [ConfigKey.Currencies]() {
      return currenciesStorageInstance.fiat
    },
  },

  [Env.Development]: {
    [ConfigKey.CookieAuth]: !IS_CYPRESS,
    [ConfigKey.CheckoutComApi]: 'https://api.sandbox.checkout.com',
    [ConfigKey.LogoutAfterInactivityMinutes]: 30,
    [ConfigKey.GooglePayMerchantId]: 'merchant-dev-id',
    [ConfigKey.ChatBaseUrl]: '/chat',
  },

  [Env.Test]: {
    [ConfigKey.CookieAuth]: true,
    [ConfigKey.CheckoutComApi]: 'https://api.sandbox.checkout.com',
    [ConfigKey.GoogleAnalyticsId]: 'UA-142060255-5',
    [ConfigKey.GooglePayMerchantId]: 'merchant-test-id',
    [ConfigKey.ChatBaseUrl]: 'https://chat.revolut.codes',
  },

  [Env.Staging]: {
    [ConfigKey.CookieAuth]: true,
    [ConfigKey.GoogleAnalyticsId]: 'UA-142060255-6',
    [ConfigKey.GoogleMapsAPIKey]: 'AIzaSyD6mVXYu37fqVT5ojmrYhNw69J55FOVgQo',
    [ConfigKey.SentryDsn]:
      'https://99852aa6d4384772b017317194049963@o104379.ingest.sentry.io/5268114',
  },

  [Env.Production]: {
    [ConfigKey.CookieAuth]: true,
    [ConfigKey.GoogleAnalyticsId]: 'UA-142060255-6',
    [ConfigKey.ReactQueryRetry]: 2,
    [ConfigKey.GoogleMapsAPIKey]: 'AIzaSyD6mVXYu37fqVT5ojmrYhNw69J55FOVgQo',
    [ConfigKey.SentryDsn]:
      'https://99852aa6d4384772b017317194049963@o104379.ingest.sentry.io/5268114',
  },
}
