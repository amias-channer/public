import { IncomingMessage } from "http"
import memoizeOne from "memoize-one"
import { UAParser } from "ua-parser-js"
import { BREAKPOINTS_PX } from "../../components/common/MediaQuery.react"
import { IS_SERVER, BROWSER } from "../../constants"

/**
 * Get boolean for whether the client or server is a desktop
 * @param {object} request node request instance
 */
export function clientIsDesktop(
  request: IncomingMessage | undefined = undefined,
) {
  if (request) {
    const ua = request.headers["user-agent"]
    return ua ? !/mobile/i.test(ua) : false
  }

  if (IS_SERVER) {
    return true
  }

  // on client
  return (
    document.body.clientWidth > 0 &&
    document.body.clientWidth > BREAKPOINTS_PX.large
  )
}

/**
 * Get a string for what the user's current browser.
 * @param {object} navigator browser's navigator object
 */
export function getUserBrowser(navigator: Navigator) {
  const sUsrAg = navigator.userAgent

  if (sUsrAg.indexOf("Firefox") > -1) {
    return BROWSER.Firefox
  } else if (sUsrAg.indexOf("Opera") > -1 || sUsrAg.indexOf("OPR") > -1) {
    return BROWSER.Opera
  } else if (sUsrAg.indexOf("Trident") > -1) {
    return BROWSER.InternetExplorer
  } else if (sUsrAg.indexOf("Edge") > -1) {
    return BROWSER.Edge
  } else if (sUsrAg.indexOf("Chrome") > -1) {
    return BROWSER.Chrome
  } else if (sUsrAg.indexOf("Safari") > -1) {
    return BROWSER.Safari
  } else {
    return BROWSER.Unknown
  }
}

const parseUserAgent = memoizeOne((userAgent: string | undefined) => {
  return new UAParser(userAgent)
})

export const isMobileDevice = (userAgent: string | undefined) => {
  return parseUserAgent(userAgent).getDevice().type === "mobile"
}

export const isMobileDeviceSSR = (req: IncomingMessage) => {
  return isMobileDevice(req.headers["user-agent"])
}

export const isMobileDeviceClient = () => {
  return isMobileDevice(window.navigator.userAgent)
}

export const getDeviceType = (userAgent: string | undefined) => {
  return parseUserAgent(userAgent).getDevice().type
}

export const isIosDevice = (userAgent: string | undefined) => {
  return parseUserAgent(userAgent).getOS().name === "iOS"
}

export const isIosDeviceClient = () => {
  return isIosDevice(window.navigator.userAgent)
}
