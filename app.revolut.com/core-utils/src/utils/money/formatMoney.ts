import { isNil, trimEnd } from 'lodash'
import isNumber from 'lodash/isNumber'
import * as Sentry from '@sentry/react'

import { CurrencyProperties, ConfigKey, getConfigValue } from '@revolut/rwa-core-config'
import { AssetsQuoteAmountDto, AssetsQuoteType } from '@revolut/rwa-core-types'

import { checkRequired } from '../checkRequired'
import { getCurrentIntlLocale, normalizeLocale } from '../i18n'
import { getAllCurrenciesConfig } from '../currencies'

const DECIMAL_BASE = 10
const DEFAULT_FRACTION = 2

// XXX is used to denote a "transaction" involving no currency.
// https://en.wikipedia.org/wiki/ISO_4217
const REPLACE_CURRENCY_CODE = 'XXX'

export const getCurrencyInfoByCurrencyCode = (currencyCode: string) => {
  const currenciesInfo = getAllCurrenciesConfig()

  const currencyInfo: CurrencyProperties | undefined = currenciesInfo[currencyCode]

  if (!currencyInfo) {
    Sentry.captureException(new Error(`No info for currencyCode = ${currencyCode}`))

    return undefined
  }

  return currencyInfo
}

/**
 * Converts 100 cents to 1 dollar (in case of US dollars).
 */
export const convertMonetaryToCurrencyUnits = (
  currency: string,
  amount: number | undefined,
) => {
  const currencyInfo = getCurrencyInfoByCurrencyCode(currency)

  if (!isNumber(amount) || Number.isNaN(amount)) {
    return undefined
  }

  const fraction = currencyInfo?.fraction ?? DEFAULT_FRACTION

  return amount / Math.pow(DECIMAL_BASE, fraction)
}

/**
 * Converts 1 dollar to 100 cents (in case of US dollars).
 */
export const convertCurrencyToMonetaryUnits = (
  currency: string,
  amount: number | undefined,
) => {
  const currencyInfo = getCurrencyInfoByCurrencyCode(currency)

  if (!isNumber(amount) || Number.isNaN(amount)) {
    return undefined
  }

  const fraction = currencyInfo?.fraction ?? DEFAULT_FRACTION

  return Math.round(amount * Math.pow(DECIMAL_BASE, fraction))
}

export enum SignDisplay {
  Auto = 'auto',
  Never = 'never',
  Always = 'always',
  ExceptZero = 'exceptZero',
}

export enum Notation {
  Standard = 'standard',
  Scientific = 'scientific',
  Engineering = 'engineering',
  Compact = 'compact',
}

export enum CurrencyDisplay {
  Symbol = 'symbol',
  NarrowSymbol = 'narrowSymbol',
  Code = 'code',
  Name = 'name',
}

export type MoneyFormatterOptions = {
  withCurrency: boolean
  useGrouping: boolean
  noDecimal?: boolean
  strictFractionAmount?: boolean
  signDisplay?: SignDisplay
  notation?: Notation
  currencyDisplay?: CurrencyDisplay
  minimumFractionDigits?: number
  maximumFractionDigits?: number
}

const DEFAULT_MONEY_FORMATTER_OPTIONS: MoneyFormatterOptions = {
  withCurrency: true,
  useGrouping: true,
  noDecimal: false,
  signDisplay: SignDisplay.Auto,
  currencyDisplay: CurrencyDisplay.Symbol,
}

const getIsNotISOCurrency = (currency: string) => currency.length !== 3

const prepareMoneyFormatter = (
  currency: string,
  locale: string,
  options: MoneyFormatterOptions,
  useFakeCurrencyCode: boolean = false,
) => {
  const currencyInfo = getCurrencyInfoByCurrencyCode(currency)
  const fraction = options.noDecimal ? 0 : currencyInfo?.fraction || DEFAULT_FRACTION
  const localePrepared = normalizeLocale(locale)

  const getMinimumFractionAmount = () => {
    if (!isNil(options.minimumFractionDigits)) {
      return options.minimumFractionDigits
    }

    if (options.noDecimal) {
      return 0
    }

    if (options.strictFractionAmount) {
      return fraction
    }

    return 2
  }

  const getMaximumFractionAmount = () =>
    isNil(options.maximumFractionDigits) ? fraction : options.maximumFractionDigits

  return new Intl.NumberFormat(localePrepared, {
    style: options.withCurrency ? 'currency' : undefined,
    currency: useFakeCurrencyCode ? REPLACE_CURRENCY_CODE : currency,
    currencyDisplay: useFakeCurrencyCode ? CurrencyDisplay.Code : options.currencyDisplay,
    minimumFractionDigits: getMinimumFractionAmount(),
    maximumFractionDigits: getMaximumFractionAmount(),
    useGrouping: options.useGrouping,
    // @ts-ignore
    signDisplay: options.signDisplay,
    notation: options.notation,
  })
}

export const formatMoney = (
  amount: number,
  currency: string,
  locale: string,
  options: MoneyFormatterOptions = DEFAULT_MONEY_FORMATTER_OPTIONS,
): string => {
  const amountInCurrencyUnits = convertMonetaryToCurrencyUnits(currency, amount)

  const isNotISOCurrency = getIsNotISOCurrency(currency)
  const formatter = prepareMoneyFormatter(currency, locale, options, isNotISOCurrency)

  const formatted = formatter.format(
    checkRequired(amountInCurrencyUnits, '"amountInCurrencyUnits" can not be null'),
  )

  return isNotISOCurrency ? formatted.replace(REPLACE_CURRENCY_CODE, currency) : formatted
}

export const formatMoneyCurrencyUnits = (
  amount: number,
  currency: string,
  locale: string,
  options: MoneyFormatterOptions = DEFAULT_MONEY_FORMATTER_OPTIONS,
) => {
  const isNotISOCurrency = getIsNotISOCurrency(currency)
  const formatter = prepareMoneyFormatter(currency, locale, options, isNotISOCurrency)

  const formatted = formatter.format(amount)

  return isNotISOCurrency ? formatted.replace(REPLACE_CURRENCY_CODE, currency) : formatted
}

export const formatMoneyToParts = (
  amount: number,
  currency: string,
  locale: string,
): Intl.NumberFormatPart[] => {
  const amountInCurrencyUnits = convertMonetaryToCurrencyUnits(currency, amount)

  const isNotISOCurrency = getIsNotISOCurrency(currency)
  const formatter = prepareMoneyFormatter(
    currency,
    locale,
    DEFAULT_MONEY_FORMATTER_OPTIONS,
    isNotISOCurrency,
  )

  const formatted = formatter.formatToParts(
    checkRequired(amountInCurrencyUnits, '"amountInCurrencyUnits" can not be null'),
  )

  if (!isNotISOCurrency) {
    return formatted
  }

  const currencyIndex = formatted.findIndex((part) => part.type === 'currency')

  if (!currencyIndex) {
    return formatted
  }

  formatted[currencyIndex] = { type: 'currency', value: currency }

  return formatted
}

export const formatMoneyWhenWholeNumber = (amount: number, currency: string) => {
  const currencyFraction = checkRequired(
    getConfigValue(ConfigKey.Currencies)[currency],
    'currency is outside of the available list',
  ).fraction

  const decimalPart = parseInt(`${amount}`.slice(-currencyFraction))

  return formatMoney(amount, currency, getCurrentIntlLocale(), {
    withCurrency: true,
    useGrouping: true,
    noDecimal: decimalPart === 0,
  })
}

// Please see: https://bitbucket.org/revolut/revolut-android/src/c060a921a37660a1a1879d542d60b17931f8a3cc/app_retail/feature_payments_bank_transfer_impl/src/main/kotlin/com/revolut/retail/feature/payments/bank_transfer/impl/mapper/BankTransferBreakdownMapperImpl.kt#lines-155
const RATE_FRACTION = 6

export const formatRate = (
  amount: number,
  currency: string,
  locale: string,
  fraction: number = RATE_FRACTION,
) => {
  return formatMoneyCurrencyUnits(amount, currency, locale, {
    ...DEFAULT_MONEY_FORMATTER_OPTIONS,
    minimumFractionDigits: 0,
    maximumFractionDigits: fraction,
  })
}

const ONE_CRYPTO_UNIT = 1

export const formatCurrencyUnit = (currencyCode: string) =>
  `${ONE_CRYPTO_UNIT} ${currencyCode}`

export const removeTrailingZerosFromAmount = (amount: string) => {
  const [integerPart, decimalPart] = amount.split('.')

  if (!decimalPart || Number(decimalPart) === 0) {
    return integerPart
  }

  return trimEnd(amount, '0')
}

export const formatWealthAmount = (amount: string, cryptoCode: string) =>
  `${removeTrailingZerosFromAmount(amount)} ${cryptoCode}`

export const formatAssetsQuoteMoney = (amount: AssetsQuoteAmountDto, locale: string) => {
  const amountCurrency = amount.symbol

  if (amount.assetType === AssetsQuoteType.Fiat) {
    return formatMoney(
      checkRequired(convertCurrencyToMonetaryUnits(amountCurrency, Number(amount.value))),
      amountCurrency,
      locale,
    )
  }

  return formatWealthAmount(amount.value, amountCurrency)
}
