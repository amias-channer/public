import { DOT } from '../constants'
import { normalizeLocale, getCurrentLocale } from '../i18n'

const SAMPLE_DECIMAL_VALUE = 1.1

export function getDecimalSeparator() {
  const decimalPart = new Intl.NumberFormat(normalizeLocale(getCurrentLocale()))
    .formatToParts(SAMPLE_DECIMAL_VALUE)
    .find((part) => part.type === 'decimal')

  if (decimalPart) {
    return decimalPart.value
  }

  return DOT
}
