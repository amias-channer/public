import { Env } from '../env'
import { FeatureArgs, UserDto, UserPortfolioDto } from '../types'
import {
  REWARDS_ENABLED_COUNTRIES,
  CRYPTO_ENABLED_COUNTRIES,
  PAYMENTS_ENABLED_COUNTRIES,
} from './constants'

export enum FeatureKey {
  AllowCardAdding = 'ALLOW_CARD_ADDING',
  AllowCardDeliveryUpdate = 'ALLOW_CARD_DELIVERY_UPDATE',
  AllowNewDownloadTheAppFlow = 'ALLOW_NEW_DOWNLOAD_THE_APP_FLOW',
  AllowPayments = 'ALLOW_PAYMENTS',
  AllowTopUpGooglePay = 'ALLOW_TOP_UP_GOOGLE_PAY',
  AllowUserSettings = 'ALLOW_USER_SETTINGS',
  CreditOnboarding = 'CREDIT_ONBOARDING',
  Crypto = 'CRYPTO',
  Rewards = 'REWARDS',
  ShowCardDetails = 'SHOW_CARD_DETAILS',
  ShowHomeBanners = 'SHOW_HOME_BANNERS',
  ShowSotVerificationFlow = 'SHOW_SOT_VERIFICATION_FLOW',
  ShowSowVerificationFlow = 'SHOW_SOW_VERIFICATION_FLOW',
  Stocks = 'STOCKS',
  StocksAnalystRatings = 'STOCKS_ANALYST_RATINGS',
  StocksPriceTargets = 'STOCKS_PRICE_TARGETS',
  StocksMostTraded = 'STOCKS_MOST_TRADED',
  StocksPopularStocks = 'STOCKS_POPULAR_STOCKS',
  StocksFinancials = 'STOCKS_FINANCIALS',
  SuspiciousTransfer = 'SUSPICIOUS_TRANSFER',
  Travel = 'TRAVEL',
  TravelBooking = 'TRAVEL_BOOKING',
  Vaults = 'VAULTS',
}

export enum UserFeatureName {
  AirportLounges = 'airportLounges',
  Commodities = 'commodities',
  Crypto = 'crypto',
  CryptoRecurringBuy = 'crypto.recurringBuys',
  DeviceInsurance = 'insurance.device',
  NewEEAInsurance = 'new.eea.insurance',
  Perks = 'perks',
  SmartDelay = 'smartDelay',
  TopUpApplePay = 'topUp.applePay',
  TopUpGooglePay = 'topUp.googlePay',
  Trading = 'wealth.trading',
  TravelInsurance = 'insurance.travel',
  VaultsSavings = 'savingsVaults',
}

const checkKycPassed = (user: UserDto | undefined) => {
  return user?.kyc === 'PASSED'
}

const checkPortfolioActive = (userPortfolio: UserPortfolioDto | undefined) => {
  return userPortfolio?.state === 'ACTIVE'
}

const checkUserCountry = (user: UserDto | undefined, allowedCountries: string[]) => {
  const userCountry = user?.address.country

  return Boolean(userCountry && allowedCountries.includes(userCountry.toUpperCase()))
}

type Features = {
  [K in FeatureKey]: (args: FeatureArgs) => boolean
}

export const FEATURES: Features = {
  [FeatureKey.Stocks]: ({ userPortfolio, isUserFeatureEnabled }) =>
    isUserFeatureEnabled(UserFeatureName.Trading) && checkPortfolioActive(userPortfolio),
  [FeatureKey.StocksAnalystRatings]: () => true,
  [FeatureKey.StocksPriceTargets]: () => true,
  [FeatureKey.StocksMostTraded]: () => true,
  [FeatureKey.StocksPopularStocks]: () => true,
  [FeatureKey.StocksFinancials]: () => true,
  [FeatureKey.Travel]: () => true,

  //
  // IN DEVELOPMENT / BETA TESTING / EXPERIMENTS
  //
  [FeatureKey.AllowCardAdding]: ({ env }) => env !== Env.Production,
  [FeatureKey.AllowCardDeliveryUpdate]: ({ env }) =>
    [Env.Development, Env.Test].includes(env),
  [FeatureKey.AllowNewDownloadTheAppFlow]: ({ env }) => env !== Env.Production,
  [FeatureKey.AllowTopUpGooglePay]: ({ env }) => env !== Env.Production,
  [FeatureKey.AllowUserSettings]: ({ env }) => [Env.Development, Env.Test].includes(env),
  [FeatureKey.ShowCardDetails]: ({ env }) => env !== Env.Production,
  [FeatureKey.ShowHomeBanners]: ({ env }) => [Env.Development, Env.Test].includes(env),
  [FeatureKey.ShowSowVerificationFlow]: ({ env }) =>
    [Env.Development, Env.Test].includes(env),
  [FeatureKey.ShowSotVerificationFlow]: ({ env }) =>
    [Env.Development, Env.Test].includes(env),
  [FeatureKey.TravelBooking]: ({ env }) => env !== Env.Production,
  [FeatureKey.CreditOnboarding]: ({ env }) => [Env.Development, Env.Test].includes(env),

  [FeatureKey.AllowPayments]: ({ env, user, isLimitedAccess }) => {
    const isAvailable = checkKycPassed(user) && !isLimitedAccess

    if ([Env.Development, Env.Test].includes(env)) {
      return isAvailable
    }

    return isAvailable && checkUserCountry(user, PAYMENTS_ENABLED_COUNTRIES)
  },

  [FeatureKey.Crypto]: ({ env, user, isUserFeatureEnabled }) => {
    const isAvailable =
      checkKycPassed(user) && isUserFeatureEnabled(UserFeatureName.Crypto)

    if ([Env.Development, Env.Test].includes(env)) {
      return isAvailable
    }

    return isAvailable && checkUserCountry(user, CRYPTO_ENABLED_COUNTRIES)
  },

  [FeatureKey.Rewards]: ({ env, user }) => {
    return env !== Env.Production || checkUserCountry(user, REWARDS_ENABLED_COUNTRIES)
  },

  [FeatureKey.SuspiciousTransfer]: () => true,
  [FeatureKey.Vaults]: ({ env }) => [Env.Development, Env.Test].includes(env),
}
