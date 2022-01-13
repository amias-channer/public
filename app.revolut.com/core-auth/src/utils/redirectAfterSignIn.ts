import { browser, Url, secureStorage, SecureStorageKey } from '@revolut/rwa-core-utils'

const REDIRECT_ALLOWED_URLS = [
  /^\/form\/.+/,
  /^\/help\/.+/,
  /^\/open-banking.+/,
  /^\/rewards\/.+/,
  /^\/travel\/.+/,
  /^\/wealth\/.+/,
]

export const redirectAfterSignIn = {
  isUrlSaved() {
    return Boolean(secureStorage.getItem(SecureStorageKey.RedirectTo))
  },

  validateUrl(url: string) {
    return REDIRECT_ALLOWED_URLS.some((rule) => rule.test(url))
  },

  saveUrl() {
    if (secureStorage.getItem(SecureStorageKey.RedirectTo)) {
      return false
    }

    const url = browser.getAppUrl()

    if (this.validateUrl(url)) {
      secureStorage.setItem(SecureStorageKey.RedirectTo, url)

      return true
    }

    return false
  },

  restoreUrl() {
    const url = secureStorage.getItem(SecureStorageKey.RedirectTo)

    secureStorage.removeItem(SecureStorageKey.RedirectTo)

    if (url && this.validateUrl(url)) {
      return url
    }

    return Url.Home
  },
}
