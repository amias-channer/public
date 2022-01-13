export enum SecureStorageKey {
  AuthUsername = 'authUsername',
  AuthPassword = 'authPassword',
  AuthTokenExpiryDate = 'authTokenExpiryDate',
  AuthTokenIsRestricted = 'authTokenIsRestricted',
  HiddenIncidentBanners = 'hiddenIncidentBanners',
  RedirectTo = 'redirectTo',
}

export enum DefaultStorageKey {
  ChatUserId = 'chatUserId',
  CookiesBannerIsClosed = 'cookiesBannerIsClosed',
  CookiesPreferences = 'cookiesPreferences',
  CryptoTargetCurrency = 'cryptoTargetCurrency',
  DeviceId = 'deviceId',
  Locale = 'locale',
  MobileAppBannerIsClosed = 'mobileAppBannerIsClosed',
  PasscodeAttemptCount = 'passcodeAttemptCount',
  PasscodeBlockedTime = 'passcodeBlockedTime',
  PaymentsStoryIsClosed = 'paymentsStoryIsClosed',
  PaymentsWelcomeTileIsClosed = 'paymentsWelcomeTileIsClosed',
  RecentlyViewedStocks = 'recentlyViewedStocks',
  ShopperBannerIsClosed = 'shopperBannerIsClosed',
  StocksCurrentCurrency = 'stocksCurrentCurrency',
  TravelUserFilters = 'travelUserFilters',
  VaultsCurrentWalletCurrency = 'vaultsCurrentWalletCurrency',
  WelcomeStoryIsClosed = 'welcomeStoryIsClosed',
}

export const KEY_PREFIX = 'rwa_'
