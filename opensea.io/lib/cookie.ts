import ServerCookies from "cookies"
import Cookies, { CookieAttributes } from "js-cookie"
import { NextPageContext } from "next"

export default class Cookie<T extends object> {
  key: string

  constructor(key: string) {
    this.key = key
  }

  get(context?: NextPageContext): T | undefined {
    if (context?.req && context.res) {
      const cookie = new ServerCookies(context.req, context.res).get(this.key)
      if (!cookie) {
        return undefined
      }
      try {
        return JSON.parse(decodeURIComponent(cookie))
      } catch (_) {
        return undefined
      }
    }
    return Cookies.getJSON(this.key)
  }

  set(value: T, options?: CookieAttributes): void {
    Cookies.set(this.key, value, options)
  }
}
