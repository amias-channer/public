import addSeconds from 'date-fns/addSeconds'
import Cookies from 'js-cookie'

import { isDevelopmentEnv } from '@revolut/rwa-core-config'

export class CookieStorage implements Storage {
  /**
   * @param expires Cookie expiration time in seconds ("Session" if not specified)
   */
  constructor(readonly expires?: number) {} // eslint-disable-line no-empty-function

  getItem(key: string) {
    return Cookies.get(key) ?? null
  }

  setItem(key: string, value: string) {
    Cookies.set(key, value, {
      secure: !isDevelopmentEnv(),
      sameSite: 'Strict',
      expires: this.expires ? addSeconds(new Date(), this.expires) : undefined,
    })
  }

  removeItem(key: string) {
    Cookies.remove(key)
  }

  getAll() {
    return Cookies.get()
  }

  clear(): void {
    throw new Error('Not implemented')
  }

  key(): string | null {
    throw new Error('Not implemented')
  }

  get length(): number {
    throw new Error('Not implemented')
  }
}
