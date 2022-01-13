import forOwn from 'lodash/forOwn'
import get from 'lodash/get'
import { getI18n } from 'react-i18next'
import { shouldPolyfill as shouldPolyfillGetCanonicalLocales } from '@formatjs/intl-getcanonicallocales/should-polyfill'
import { shouldPolyfill as shouldPolyfillNumberFormat } from '@formatjs/intl-numberformat/should-polyfill'
import { shouldPolyfill as shouldPolyfillPluralRules } from '@formatjs/intl-pluralrules/should-polyfill'

import { getI18nNamespaces, I18nNamespace } from '@revolut/rwa-core-utils'

export const getLocaleLanguage = (locale: string) => locale.split(/[-_]/)[0]

const loadIntlPolyfill = async (locale: string) => {
  const localeLanguage = getLocaleLanguage(locale)

  if (shouldPolyfillGetCanonicalLocales()) {
    await import('@formatjs/intl-getcanonicallocales/polyfill')
  }

  if (shouldPolyfillPluralRules()) {
    await import('@formatjs/intl-pluralrules/polyfill')
  }

  if (get(Intl.PluralRules, 'polyfilled')) {
    await import(
      /* webpackInclude: /\/(bg|cs|da|de|el|en|es|fr|hr|hu|it|ja|lt|lv|nb|nl|pl|pt|ro|ru|sk|sv|zh)\.js$/ */
      /* webpackChunkName: "intl-pluralrules-[request]" */
      `@formatjs/intl-pluralrules/locale-data/${localeLanguage}`
    )
  }

  if (shouldPolyfillNumberFormat()) {
    await import('@formatjs/intl-numberformat/polyfill')
  }

  if (get(Intl.NumberFormat, 'polyfilled')) {
    await import(
      /* webpackInclude: /\/(bg|cs|da|de|el|en|es|fr|hr|hu|it|ja|lt|lv|nb|nl|pl|pt|ro|ru|sk|sv|zh)\.js$/ */
      /* webpackChunkName: "intl-numberformat-[request]" */
      `@formatjs/intl-numberformat/locale-data/${localeLanguage}`
    )
  }
}

export const loadLocaleData = (locale: string): Promise<void> => {
  const i18n = getI18n()
  const bundle = i18n.getResourceBundle(locale, I18nNamespace.Common)

  if (bundle) {
    return loadIntlPolyfill(locale)
  }

  const loadI18n = () =>
    import(/* webpackChunkName: "locale-[request]" */ `../../i18n/${locale}.json`).then(
      ({ default: messages }) => {
        forOwn(getI18nNamespaces(messages), (value: object, key: string) => {
          i18n.addResourceBundle(locale, key, value)
        })

        i18n.changeLanguage(locale)
      },
      (e) =>
        Promise.reject(
          new Error(`Could not load locale (i18n): ${locale} (reason: ${e})`),
        ),
    )

  return loadIntlPolyfill(locale).then(loadI18n, (e) =>
    Promise.reject(
      new Error(`Could not load locale (intl polyfill): ${locale} (reason: ${e})`),
    ),
  )
}
