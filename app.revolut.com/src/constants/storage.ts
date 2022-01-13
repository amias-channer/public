import { safeJSONParse } from '../helpers/utils'

export const LocalStorage = {
  CHAT_AUTH_TOKEN: 'chatAuthToken',
  CHAT_ANON_SESSION: 'chatAnonSession',
  CHAT_LAST_READ: 'chatLastRead',
  CHAT_RETAIL_FINGERPRINT: 'rwa_deviceId',
  CHAT_BUSINESS_FINGERPRINT: 'fingerprint',
  SUPPORT_ONLY_IN_ENGLISH_BANNER_DISMISS_TIMESTAMP:
    'supportOnlyInEnglishBannerDismissTimestamp',
}

export type LocalStorageKey = typeof LocalStorage[keyof typeof LocalStorage]

export const SessionStorage = {
  CLOSED_BANNERS: 'closedBanners',
  ISSUE_DESCRIPTION: 'issueDescription',
}

export type SessionStorageKey = typeof SessionStorage[keyof typeof SessionStorage]

export const setItemToLocalStorage = (key: LocalStorageKey, item: any) => {
  localStorage.setItem(key, JSON.stringify(item))
}

export const getItemFromLocalStorage = (key: LocalStorageKey): any => {
  const item = localStorage.getItem(key)
  return safeJSONParse(item)
}

export const removeItemFromLocalStorage = (key: LocalStorageKey) => {
  localStorage.removeItem(key)
}

export const setItemToSessionStorage = (key: LocalStorageKey, item: any) => {
  sessionStorage.setItem(key, JSON.stringify(item))
}

export const getItemFromSessionStorage = (key: SessionStorage) => {
  const item = sessionStorage.getItem(key)
  return safeJSONParse(item)
}

export const removeItemFromSessionStorage = (key: SessionStorage) => {
  sessionStorage.removeItem(key)
}
