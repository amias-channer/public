import i18n from 'i18next'
import keys from 'lodash/keys'
import { initReactI18next } from 'react-i18next'

import {
  ConfigKey,
  getConfigValue,
  isDevelopmentEnv,
  IS_CYPRESS,
} from '@revolut/rwa-core-config'
import {
  defaultStorage,
  getDetectedLocale,
  getI18nNamespaces,
  DefaultStorageKey,
} from '@revolut/rwa-core-utils'

import localeEn from '../i18n/en.json'

export const setupI18n = async () => {
  const fallbackLocale = getConfigValue(ConfigKey.FallbackLocale)

  let namespacesEnAu = {}
  let namespacesEnUs = {}
  let namespacesZhCn = {}

  if (!IS_CYPRESS) {
    const [localeEnAu, localeEnUs, localeZhCn] = await Promise.all([
      // Mobile Safari has a problem with loading I18N modules with underscore
      import('../i18n/en_AU.json'),
      import('../i18n/en_US.json'),
      // Must by synced with the "FallbackLocale" config value
      import('../i18n/zh_CN.json'),
    ])

    namespacesEnAu = getI18nNamespaces(localeEnAu)
    namespacesEnUs = getI18nNamespaces(localeEnUs)
    namespacesZhCn = getI18nNamespaces(localeZhCn)
  }

  const namespacesEn = getI18nNamespaces(localeEn)

  await i18n.use(initReactI18next).init({
    lng: fallbackLocale,
    fallbackLng: fallbackLocale,
    debug: isDevelopmentEnv(),
    // The same for all locales
    ns: keys(namespacesEn),
    resources: {
      en: namespacesEn,
      en_AU: namespacesEnAu,
      en_US: namespacesEnUs,
      zh_CN: namespacesZhCn,
    },
    react: {
      useSuspense: false,
    },
  })

  const detectedLocale = getDetectedLocale()
  const currentLocale = defaultStorage.getItem(DefaultStorageKey.Locale)

  if (detectedLocale && !currentLocale) {
    defaultStorage.setItem(DefaultStorageKey.Locale, detectedLocale.locale)
  }
}
