import { getCurrentIntlLocale } from '../i18n'
import { Notation } from '../money'

export const formatLikesAmount = (likesAmount: number): string => {
  const intl = new Intl.NumberFormat(getCurrentIntlLocale(), {
    maximumFractionDigits: 1,
    notation: Notation.Compact,
  })
  return intl.format(likesAmount)
}
