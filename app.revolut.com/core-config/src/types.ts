// FIXME: Replace with a real type (https://revolut.atlassian.net/browse/PRO-3758)
import { UserFeatureName } from 'config'

import { Env } from './env'

export type UserDto = any
export type UserPortfolioDto = any

export type CurrencyProperties = {
  currency: string
  symbol: string
  code: string
  fraction: number
  country: string
}

export type Currency = string

export type CurrenciesType = Record<Currency, CurrencyProperties>

export type FeatureArgs = {
  env: Env
  user?: UserDto
  detectedCountryCode: string | null
  userPortfolio?: UserPortfolioDto
  isLimitedAccess?: boolean
  isUserFeatureEnabled: (userFeatureName: UserFeatureName) => boolean
}

export type CurrencyDto = {
  isoCode: string
  exponent: number
  isCrypto: boolean
  isCommodity: boolean
  name: string
  symbol: string
  createdAt: number
  createdBy: string
  description?: string
  numericCode?: number
}

export enum CurrencyType {
  Crypto = 'crypto',
  Fiat = 'fiat',
  Commodity = 'commodity',
}

export type CurrenciesFlag = Record<Currency, string>
