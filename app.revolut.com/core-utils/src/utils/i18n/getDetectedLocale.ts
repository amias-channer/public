import { ConfigKey, getConfigValue } from '@revolut/rwa-core-config'
import { Locale } from '@revolut/rwa-core-types'

import { browser } from '../browser'
import { normalizeLocale } from './normalizeLocale'

const LOCALE_SEPARATOR = '-'

const parseBrowserLanguage = (browserLanguage: string) => {
  const [language, country] = browserLanguage.split(LOCALE_SEPARATOR)

  return { language, country }
}

export const getDetectedLocale = () => {
  const browserLanguage = browser.getLanguage()
  const supportedLocales = getConfigValue<ReadonlyArray<Locale>>(
    ConfigKey.SupportedLocales,
  )

  // Full match (language and country) locale
  const fullMatchLocale = supportedLocales.find(
    (item) => normalizeLocale(item.locale) === browserLanguage,
  )

  if (fullMatchLocale) {
    return fullMatchLocale
  }

  const { language } = parseBrowserLanguage(browserLanguage)

  // Partial match (language only) locale
  return supportedLocales.find((item) => item.locale === language)
}
