import {
  checkIfCryptoCurrency,
  checkRequired,
  getCurrentIntlLocale,
  formatCurrencyUnit,
  formatRate,
  formatMoney,
  convertCurrencyToMonetaryUnits,
} from '@revolut/rwa-core-utils'

export const checkIfCryptoTransaction = (currencyFrom: string, currencyTo: string) =>
  checkIfCryptoCurrency(currencyFrom) || checkIfCryptoCurrency(currencyTo)

const FIAT_RATE_FRACTION = 4

export const showExchangeRate = (
  currencyFrom: string,
  currencyTo: string,
  rate: number,
) => {
  const amountFrom = checkRequired(
    convertCurrencyToMonetaryUnits(currencyFrom, 1),
    '"amountFrom" can not be empty',
  )

  const locale = getCurrentIntlLocale()

  const getCryptoRate = (cryptoCode: string, fiatCode: string) => {
    return `${formatCurrencyUnit(cryptoCode)} = ${formatRate(
      rate,
      fiatCode,
      locale,
      FIAT_RATE_FRACTION,
    )}`
  }

  if (checkIfCryptoCurrency(currencyFrom)) {
    return getCryptoRate(currencyFrom, currencyTo)
  }

  if (checkIfCryptoCurrency(currencyTo)) {
    return getCryptoRate(currencyTo, currencyFrom)
  }

  return `${formatMoney(amountFrom, currencyFrom, locale)} = ${formatRate(
    rate,
    currencyTo,
    locale,
  )}`
}
