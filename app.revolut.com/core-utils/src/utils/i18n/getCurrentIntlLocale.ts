import { getI18n } from 'react-i18next'

import { DEFAULT_LOCALE } from './localization'

export const getCurrentIntlLocale = (): string => {
  const i18n = getI18n()

  return i18n.language || DEFAULT_LOCALE
}
