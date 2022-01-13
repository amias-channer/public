import { difference, keys, concat, values, uniq } from 'lodash'
import { useState } from 'react'

import {
  browser,
  cookieStorage,
  defaultStorage,
  DefaultStorageKey,
  getPrefixedKey,
  RwaNginxCookieName,
  SecureStorageKey,
} from '@revolut/rwa-core-utils'

type CookiesPreferences = {
  analyticsTargetingEnabled: boolean
}

const defaultCookiesPreferences: CookiesPreferences = {
  analyticsTargetingEnabled: true,
}

const COOKIES_WHITELIST = uniq(
  concat<string>(
    values(RwaNginxCookieName),
    values(DefaultStorageKey),
    values(SecureStorageKey),
  ),
).map(getPrefixedKey)

export const useCookiesPreferences = () => {
  const [cookiesPreferences, setPreferences] = useState(
    defaultStorage.getItem<CookiesPreferences>(DefaultStorageKey.CookiesPreferences) ||
      defaultCookiesPreferences,
  )

  const saveAndApplyNewPreferences = (newCookiePreferences: CookiesPreferences) => {
    if (!newCookiePreferences.analyticsTargetingEnabled) {
      difference(keys(cookieStorage.getAll()), COOKIES_WHITELIST).forEach((cookieName) =>
        cookieStorage.removeItem(cookieName),
      )
    }

    defaultStorage.setItem(DefaultStorageKey.CookiesPreferences, newCookiePreferences)
    setPreferences(newCookiePreferences)
    browser.reloadLocation()
  }

  return {
    cookiesPreferences,
    saveAndApplyNewPreferences,
  }
}
