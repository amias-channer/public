import { Currency, MoneyValue } from '../../../types'

const DEFAULT_FRACTION_DIGITS = 2

export const getCurrencyFromMoneyValue = (
  value: Partial<MoneyValue>,
  currencyOptions: Currency[],
) => {
  if (!value.currency) throw new Error('Currency should not be empty')
  const options = currencyOptions.find(({ code }) => code === value.currency)
  if (!options) throw new Error('Currency options not found')
  return options
}

export const limitDigitsAfterDecimalPoint = (amountValue: string, currency: Currency) => {
  const decimalPointPosition = amountValue.lastIndexOf('.')
  if (decimalPointPosition === -1) return amountValue
  const fractionDigits = currency.fractionDigits ?? DEFAULT_FRACTION_DIGITS
  return amountValue.substr(0, decimalPointPosition + fractionDigits + 1)
}

export const moneyValueToInputValue = (
  moneyValue: Partial<MoneyValue> | undefined,
  currency: Currency,
) => {
  if (!moneyValue || moneyValue.amount === undefined) return ''
  const fractionDigits = currency.fractionDigits ?? DEFAULT_FRACTION_DIGITS
  return String(moneyValue.amount / Math.pow(10, fractionDigits))
}

export const inputValueToMinorUnitAmount = (inputValue: string, currency: Currency) => {
  if (inputValue === '') return NaN
  const fractionDigits = currency.fractionDigits ?? DEFAULT_FRACTION_DIGITS
  return Math.trunc(Number(inputValue) * Math.pow(10, fractionDigits))
}
