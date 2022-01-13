import { ConfigKey, getConfigValue } from '@revolut/rwa-core-config'

import { defaultStorage, DefaultStorageKey } from '../storage'

export const getCurrentLocale = () => {
  const fallbackLocale = getConfigValue(ConfigKey.FallbackLocale)

  return defaultStorage.getItem(DefaultStorageKey.Locale) ?? fallbackLocale
}
