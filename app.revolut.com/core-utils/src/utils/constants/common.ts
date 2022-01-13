import mapValues from 'lodash/mapValues'
import { SIZES } from '@revolut/ui-kit'

import { ConfigKey, getConfigValue } from '@revolut/rwa-core-config'
import { Country, Dictionary, FxInterval, FxRange } from '@revolut/rwa-core-types'

export const COUNTRIES = getConfigValue<Dictionary<Country>>(ConfigKey.Countries)

export enum FlexProp {
  Auto = '1 1 auto',
}

export enum IconSize {
  Small = SIZES.icon['16'],
  Medium = SIZES.icon['24'],
  Large = SIZES.icon['104'],
  ExtraLarge = SIZES.icon['120'],
}

export enum Url {
  Root = '/',
  Error = '/error',
  GetTheApp = '/gettheapp',

  // Home
  Home = '/home',
  HomeTab = '/home/:tab',

  // Auth
  DownloadTheApp = '/download',
  LoggedOut = '/logged-out',
  InvalidateAccessRecovery = '/invalidate-access-recovery/:sessionId',
  SignIn = '/login',
  SignInOtpEmailConfirm = '/login/email/confirm',
  SignUp = '/signup',
  SignUpTopUp = '/signup/topup',
  Start = '/start',
  SignOut = '/retail/signout',

  // Account
  Accounts = '/accounts',
  AccountsTransactions = '/accounts/transactions',
  AccountsTopUp = '/accounts/topup',
  Account = '/accounts/:id',
  AccountTransactions = '/accounts/:id/transactions',
  AccountDetails = '/accounts/:id/details',
  AccountStatement = '/accounts/:id/statement',

  // Cards
  Cards = '/cards',
  CardsHome = '/home/cards',
  CardsOverview = '/cards/overview',
  CardOverview = '/cards/overview/:cardId',
  CardSettings = '/cards/:cardId',
  CardSettingsSecurity = '/cards/settings/security/:cardId',
  CardSettingsOther = '/cards/settings/other/:cardId',
  CardOrdering = '/cards/order',
  CardOrderingDebit = '/cards/order/debit',
  CardOrderingVirtual = '/cards/order/virtual',
  CardOrderingCheckout = '/cards/order/checkout',
  CardOrderingTopUp = '/cards/order/topup',
  CardDeliveryUpdate = '/cards/delivery/:cardId',
  CardTerminationSuccess = '/cards/termination/success',

  // Crypto
  Crypto = '/crypto',
  CryptoInvest = '/crypto/invest',
  CryptoHoldings = '/crypto/investments',
  CryptoHome = '/home/crypto',
  CryptoTopMovers = '/crypto/topMovers',
  CryptoPopularAssets = `/crypto/popularAssets`,
  CryptoDisclosure = '/crypto/disclosure',
  CryptoConfirmation = '/crypto/:cryptoCode/:exchangeMethod/confirm',
  CryptoDetailsOverview = '/crypto/:cryptoCode/overview',
  CryptoRecurringOrders = '/crypto/:cryptoCode/recurring',
  CryptoRecurringOrderDetails = '/crypto/:cryptoCode/recurring/:recurringOrderId',
  CryptoTransactions = '/crypto/:cryptoCode/transactions',
  CryptoTransactionDetails = '/crypto/:cryptoCode/transactions/:transactionId',
  CryptoExchange = '/crypto/:cryptoCode/:exchangeMethod',
  CryptoExchangeConfirmation = '/crypto/:cryptoCode/:exchangeMethod/confirm',
  CryptoStatement = '/crypto/:cryptoCode/statement',
  CryptoStats = '/crypto/:cryptoCode/stats',

  // Incident
  IncidentContent = '/incident/:incidentId',

  // Rewards
  RewardsHome = '/rewards',
  RewardDetails = '/rewards/:rewardId',
  RewardFeedback = '/rewards/:rewardId/feedback',
  RewardsGroup = '/rewards/group/:rewardsGroupId',
  RedirectToRewardInstance = '/rewards/redirect/:rewardPublicId',

  // Wealth
  Wealth = '/wealth',
  WealthNews = '/wealth/news',
  WealthNewsStocks = '/wealth/news/stocks',
  WealthStocksHome = '/home/stocks',
  WealthTradingDisclosures = '/wealth/trading-disclosures',
  WealthStocksAddMoney = '/wealth/stocks/add-money',
  WealthStocksWithdraw = '/wealth/stocks/withdraw',
  WealthStocksTransactions = '/wealth/stocks/transactions',
  WealthStocksTransaction = '/wealth/stocks/transactions/:transactionId',
  WealthStocksCashHolding = '/wealth/stocks/cash-holdings/:holdingId',
  WealthStocksSearch = '/wealth/stocks/search',
  WealthStocksInvest = '/wealth/stocks/invest',
  WealthStocksCollections = '/wealth/stocks/collections',
  WealthStocksCollection = '/wealth/stocks/collections/:key',
  WealthStocksTopMovers = '/wealth/stocks/top-movers',
  WealthStocksMostTraded = '/wealth/stocks/most-traded',
  WealthStocksPopularStocks = '/wealth/stocks/popular-stocks',
  WealthStocksHoldingsInformation = '/wealth/stocks/holdings-information',
  WealthStocksBankBalances = '/wealth/stocks/holdings-information/bank-balances',
  WealthStocksBrokerageHoldings = '/wealth/stocks/holdings-information/brokerage-holdings',
  WealthStock = '/wealth/stocks/:symbol',
  WealthStockOrder = '/wealth/stocks/orders/:orderId',
  WealthStockOrders = '/wealth/stocks/:symbol/orders',
  WealthStockOrderCreate = '/wealth/stocks/:symbol/orders/create',
  WealthStockOrderConfirm = '/wealth/stocks/:symbol/orders/confirm',
  WealthStockNews = '/wealth/stocks/:symbol/news',
  WealthStockTransactions = '/wealth/stocks/:symbol/transactions',
  WealthStockFinancials = '/wealth/stocks/:symbol/financials',

  // Credit Onboarding
  CreditOnboardingHome = '/credit-onboarding',
  CreditOnboardingPersonalDetails = '/credit-onboarding/personal-details',
  CreditOnboardingOtp = '/credit-onboarding/otp',
  CreditOnboardingHomeAddress = '/credit-onboarding/home-address',
  CreditOnboardingQuestionnaire = '/credit-onboarding/questionnaire',

  CreditOnboardingIdentificationDocuments = '/credit-onboarding/identification-documents',
  CreditOnboardingIncome = '/credit-onboarding/income',
  CreditOnboardingSpending = '/credit-onboarding/spending',

  CreditOnboardingLoanOffer = '/credit-onboarding/loan-offer',

  // Travel
  TravelHome = '/travel',
  TravelSearch = '/travel/search',
  TravelProperty = '/travel/property/:property',
  TravelPropertyRooms = '/travel/property/:property/rooms',
  TravelPropertyPhotos = '/travel/property/:property/photo',
  TravelPropertyPhoto = '/travel/property/:property/photo/:url',
  TravelBooking = '/travel/booking/:booking',
  TravelBookingProperty = '/travel/booking/:booking/property/:property',
  TravelBookingPropertyPhotos = '/travel/booking/:booking/property/:property/photo',
  TravelBookingPropertyPhoto = '/travel/booking/:booking/property/:property/photo/:url',
  TravelHelp = '/help/more/stays',

  // Settings
  Settings = '/settings',
  ChangePasscode = '/settings/change-passcode',
  ChangePhoneNumber = '/settings/change-number',
  PersonalDetails = '/settings/details',

  // Verifications /Sow and /Sot
  SowVerification = '/verifications/source-of-wealth',
  SotVerification = '/verifications/source-of-transaction',

  // Top Up
  TopUpWorldpay3ds = '/worldpay/3ds',

  // Transactions
  TransactionsList = '/transactions',
  TransactionDetailsOnSide = '/transactions/:transactionId',
  TransactionDetails = '/transaction/:transactionId',

  // Open Banking
  OpenBanking = '/open-banking',

  // Payments
  Payments = '/payments',
  PaymentsWhoToPay = '/payments/who-to-pay',
  PaymentsAmount = '/payments/amount',

  // Suspicious transfer
  SuspiciousTransfer = '/suspicious-transfer',

  // Vaults
  Vaults = '/vaults',
  VaultFunding = '/vaults/:vaultId/fund',
  VaultOneTimeTransfer = '/vaults/:vaultId/one-time-transfer',
  VaultRecurringTransfer = '/vaults/:vaultId/recurring-transfer',
  VaultRecurringTransferDetails = '/vaults/:vaultId/recurring-transfer/details',
  VaultSpareChange = '/vaults/:vaultId/spare-change',
  VaultWithdrawal = '/vaults/:vaultId/withdraw',

  // Device management
  DeviceManagement = '/device-management',

  // Other
  Help = '/help',
  RequestScopedToken = '/selfie-verification',
  UnsupportedLocation = '/unsupported-location',
  VerifyYourIdentity = '/verify-your-identity',
  Form = '/form/:formId',
}

export enum QueryKey {
  Accounts = 'Accounts',
  ApplePayGatewayConfig = 'ApplePayGatewayConfig',
  AssetsQuote = 'AssetsQuote',
  Beneficiary = 'Beneficiary',
  CardDeliveryMethods = 'CardDeliveryMethods',
  CardIssuerInfo = 'CardIssuerInfo',
  Cards = 'Cards',
  CardsLimit = 'CardsLimit',
  CommonConfig = 'CommonConfig',
  CryptoCurrenciesConfig = 'CryptoCurrenciesConfig',
  CryptoDetails = 'CryptoDetails',
  CryptoHoldings = 'CryptoHoldings',
  Currencies = 'Currencies',
  CurrentPricingPlan = 'CurrentPricingPlan',
  DeliveryMethods = 'DeliveryMethods',
  DepositProductsPerPlans = 'DepositProductsPerPlans',
  FirstTransaction = 'FirstTransaction',
  FxLineChart = 'FxLineChart',
  GetCreditApplicationStatus = 'GetCreditApplicationStatus',
  GetPreOffer = 'GetPreOffer',
  GetQuestionnaire = 'GetQuestionnaire',
  GooglePayGatewayConfig = 'GooglePayGatewayConfig',
  Holding = 'Holding',
  Incidents = 'Incidents',
  Instrument = 'Instrument',
  InstrumentChart = 'InstrumentChart',
  InstrumentCollections = 'InstrumentCollections',
  InstrumentDetails = 'InstrumentDetails',
  InstrumentNews = 'InstrumentNews',
  InstrumentNewsPersonalised = 'InstrumentNewsPersonalised',
  Instruments = 'Instruments',
  InstrumentSummary = 'InstrumentSummary',
  InstrumentTickers = 'InstrumentTickers',
  InstrumentTopMovers = 'InstrumentTopMovers',
  InstrumentMostTraded = 'InstrumentMostTraded',
  InstrumentsMostOwned = 'InstrumentsMostOwned',
  InstrumentFinancials = 'InstrumentFinancials',
  BrokerageHoldings = 'BrokerageHoldings',
  InstrumentNBBORate = 'InstrumentNBBORate',
  JuniorConfig = 'JuniorConfig',
  OriginalCardDesign = 'OriginalCardDesign',
  PendingCheckouts = 'PendingCheckouts',
  PhysicalCardDesigns = 'PhysicalCardDesigns',
  PhysicalCardPrice = 'PhysicalCardPrice',
  PhysicalCardsLimit = 'PhysicalCardsLimit',
  PlanInsuranceReviewDetails = 'PlanInsuranceReviewDetails',
  PortfolioOrderCancellable = 'PortfolioOrderCancellable',
  PortfolioOrders = 'PortfolioOrders',
  PricingPlans = 'PricingPlans',
  Quotes = 'Quotes',
  RecurringPayments = 'RecurringPayments',
  Reward = 'Reward',
  RewardPublic = 'RewardPublic',
  Rewards = 'Rewards',
  SignInTokenStatus = 'SignInTokenStatus',
  SmartDelayConfig = 'SmartDelayConfig',
  Statement = 'Statement',
  TopupTransactionStatus = 'TopupTransactionStatus',
  Transaction = 'Transaction',
  Transactions = 'Transactions',
  Travel = 'Travel',
  User = 'User',
  UserBillAccounts = 'UserBillAccounts',
  UserCard = 'UserCard',
  UserCardImageData = 'UserCardImageData',
  UserCards = 'UserCards',
  UserCompany = 'UserCompany',
  UserConfig = 'UserConfig',
  UserExist = 'UserExist',
  UserFeatures = 'UserFeatures',
  UserOrderLimits = 'UserOrderLimits',
  UserPicture = 'UserPicture',
  UserPortfolio = 'UserPortfolio',
  UserPortfolioRecentOrders = 'UserPortfolioRecentOrders',
  UserPortfolioRecentTransactions = 'UserPortfolioRecentTransactions',
  UserPortfolioTransactions = 'UserPortfolioTransactions',
  UserTopupCards = 'UserTopupCards',
  UserVaults = 'UserVaults',
  VaultImage = 'VaultImage',
  VerificationCode = 'VerificationCode',
  VirtualCardDesigns = 'VirtualCardDesigns',
  VirtualCardPrice = 'VirtualCardPrice',
  VolatilityQuotes = 'VolatilityQuotes',
  WaitingListCurrentPosition = 'WaitingListCurrentPosition',
  Wallet = 'Wallet',
  WealthStockConfig = 'WealthStockConfig',
}

// Keep values in lower case
export enum HttpHeader {
  AcceptLanguage = 'accept-language',
  AccessRecoverySessionId = 'x-access-recovery-session-id',
  ApiAuthorization = 'x-api-authorization',
  BrowserApplication = 'x-browser-application',
  ChatVersion = 'x-chat-version',
  ClientGeoLocation = 'x-client-geo-location',
  ClientVersion = 'x-client-version',
  CreditOnboarding = 'x-credit-onboarding',
  DeviceId = 'x-device-id',
  IdempotencyKey = 'x-idempotency-key',
  SkipDisclosure = 'x-skip-disclosure',
  SkipSimilarityCheck = 'x-skip-similarity-check',
  UserId = 'x-user-id',
  VerifyCode = 'x-verify-code',
  VerifyPassword = 'x-verify-password',
}

export enum HttpCode {
  Ok = 200,
  NoContent = 204,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  UnprocessableEntity = 422,
  UnavailableLegalReasons = 451,
  InternalServerError = 500,
}

export enum KeyboardKey {
  ArrowDown = 'ArrowDown',
  ArrowLeft = 'ArrowLeft',
  ArrowRight = 'ArrowRight',
  ArrowUp = 'ArrowUp',
  Backspace = 'Backspace',
  Enter = 'Enter',
  Esc = 'Escape',
}

export enum SentryTag {
  Source = 'app.source',
  DeviceId = 'app.device-id',
  Context = 'app.context',
}

export enum CurrencyUnit {
  Crypto = 1,
  Fiat = 100,
}

export const CountryCode = mapValues(COUNTRIES, 'id')

export const FxRangeIntervalMap = {
  [FxRange.OneDay]: FxInterval.FiveMinutes,
  [FxRange.OneWeek]: FxInterval.FifteenMinutes,
  [FxRange.OneMonth]: FxInterval.NinetyMinutes,
  [FxRange.ThreeMonths]: FxInterval.OneDay,
  [FxRange.SixMonths]: FxInterval.OneDay,
  [FxRange.OneYear]: FxInterval.OneDay,
}

export const DOT = '.'
export const SPACE = ' '
export const BULLET = '·'
