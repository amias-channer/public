import noop from 'lodash/noop'
import qs from 'qs'

export const browser = {
  isIOS() {
    return /(iPhone|iPod|iPad)/gi.test(this.getUserAgent())
  },

  isIPhoneOrIPad() {
    return /(iPhone|iPad)/gi.test(this.getUserAgent())
  },

  getIOSVersion() {
    return parseFloat(
      this.getUserAgent().replace(
        /.+(iPhone|iPad|iPod).+OS(\s|_)(\d+)(_(\d+))?(_(\d+))?.+/gi,
        '$3.$5',
      ),
    )
  },

  isAndroid() {
    return /(Android|BlackBerry)/gi.test(this.getUserAgent())
  },

  isMobile() {
    return this.isIOS() || this.isAndroid()
  },

  getOrigin() {
    return window.location.origin
  },

  getHostname() {
    return window.location.hostname
  },

  getUrlWithOrigin(url: string) {
    return `${window.location.origin}${url}`
  },

  getPathname() {
    return window.location.pathname
  },

  getSearch() {
    return window.location.search.substring(1)
  },

  getQueryParams<T>() {
    return qs.parse(this.getSearch()) as unknown as T
  },

  getUserAgent() {
    return window.navigator.userAgent
  },

  getLanguage() {
    return window.navigator.language
  },

  getAppUrl() {
    return `${window.location.pathname}${window.location.search}${window.location.hash}`
  },

  navigateTo(url: string) {
    window.location.assign(url)
  },

  reloadLocation() {
    window.location.reload()
  },

  canRequestUserMedia() {
    return Boolean(
      'getUserMedia' in window.navigator ||
        (window.navigator.mediaDevices && window.navigator.mediaDevices.getUserMedia),
    )
  },

  requestUserMedia(
    constraints: MediaStreamConstraints,
    onSuccess: (stream: MediaStream) => void,
    onError: VoidFunction = noop,
  ) {
    if ('getUserMedia' in window.navigator) {
      // "getUserMedia" is deprecated. For more details please see:
      // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/getUserMedia
      // @ts-expect-error deprecated
      window.navigator.getUserMedia(constraints, onSuccess, onError)

      return
    }

    if (window.navigator.mediaDevices.getUserMedia) {
      window.navigator.mediaDevices
        .getUserMedia(constraints)
        .then(onSuccess)
        .catch(onError)

      return
    }

    throw new Error('No user media devices are available')
  },

  scrollTo(options: ScrollToOptions) {
    return window.scrollTo(options)
  },

  getFingerprint() {
    return {
      browserScreenWidth: window.screen.width,
      browserScreenHeight: window.screen.height,
      challengeWindowWidth: window.screen.width,
      browserColorDepth: window.screen.colorDepth,
      browserJavaEnabled: window.navigator.javaEnabled(),
      timeZoneUtcOffsetMins: new Date().getTimezoneOffset(),
    }
  },
}
