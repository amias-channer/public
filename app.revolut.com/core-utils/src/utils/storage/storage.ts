import { BaseStorage } from './baseStorage'
import { DefaultStorageKey, SecureStorageKey } from './constants'
import { CookieStorage } from './cookieStorage'

const ONE_YEAR = 365 * 24 * 60 * 60

export const defaultStorage = new BaseStorage<DefaultStorageKey>(
  window.localStorage ?? new CookieStorage(ONE_YEAR),
)

/**
 * @deprecated
 */
export const secureStorage = new BaseStorage<SecureStorageKey>(
  window.sessionStorage ?? new CookieStorage(),
)

export const cookieStorage = new BaseStorage(new CookieStorage())
