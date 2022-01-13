import { SPACE } from '../constants'
import { normalizeLocale, getCurrentLocale } from '../i18n'

const SAMPLE_THOUSAND_VALUE = 1000

export function getThousandSeparator() {
  const thousandPart = new Intl.NumberFormat(normalizeLocale(getCurrentLocale()))
    .formatToParts(SAMPLE_THOUSAND_VALUE)
    .find((part) => part.type === 'group')

  if (thousandPart) {
    return thousandPart.value
  }

  return SPACE
}
