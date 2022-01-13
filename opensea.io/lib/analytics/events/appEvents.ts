import { getTrackingFn } from "../utils"

export const trackLogout = getTrackingFn("logout")
export const trackSignup = getTrackingFn("signup")
export const trackCopyAddress = getTrackingFn("copy address")
export const trackLoadApp = getTrackingFn<{
  path: string
  queryString: string
}>("load app")
export const trackClickLink = getTrackingFn<{
  url?: string
  target?: string
  source?: string
  currentUrl: string
  type: "internal" | "external"
}>("click link")

export const trackRefreshFunds = getTrackingFn("refresh funds")
