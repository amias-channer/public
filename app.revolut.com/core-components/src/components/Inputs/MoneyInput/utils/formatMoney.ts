import { ConfigKey, getConfigValue } from '@revolut/rwa-core-config'
import { CurrenciesType, Currency } from '@revolut/rwa-core-types'

/**
 * Hack for the known issue, when the Intl.NumberFormat method is not
 * substituting currency code with currency symbol for specific locales
 * (for example, 'en-PL' locale with 'PLN' currency code doesn't replace 'PLN' with 'zł').
 */
export const replaceCurrencySymbolInParts = (
  parts: Intl.NumberFormatPart[],
  currencyCode: Currency,
) => {
  const currencies = getConfigValue<CurrenciesType>(ConfigKey.Currencies)

  if (!Array.isArray(parts)) {
    return undefined
  }

  const symbol = currencies[currencyCode].symbol

  if (symbol === undefined) {
    return parts
  }

  return parts.map((part) =>
    part.type === 'currency' ? { ...part, value: symbol } : part,
  )
}

export const joinNumberParts = (parts: Intl.NumberFormatPart[]) => {
  if (!Array.isArray(parts)) {
    return undefined
  }

  return parts.map((part) => part.value).join('')
}
