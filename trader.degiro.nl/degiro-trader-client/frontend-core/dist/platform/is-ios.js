/**
 * @description is device on iOS (including iPadOS) platform.
 *  Why not MSStream? Microsoft injected the word iPhone in IE11's userAgent in order to try and fool Gmail somehow.
 *  Therefore we need to exclude it.
 * @exception
 *  This function doesn't work on iOS/iPadOS with enabled "Request Desktop Site" mode
 *  (details https://stackoverflow.com/questions/58344491).
 *
 *  In general we should avoid using user agent detection, but rather use feature detection - e.g. isTouchDevice
 *  This function should be used only in combination with isWebViewApp check where we know that we 100% inside the
 *  "native" app
 * @returns {boolean}
 */
export default function isIOS() {
    // Check Cordova breadcrumbs for iOS (see isWebViewApp) but filter out Android breadcrumbs
    // This check helps to detect iPadOS via webview
    if (typeof window !== 'undefined' && window.Ionic) {
        return !window._cordovaNative;
    }
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && typeof MSStream === 'undefined';
}
//# sourceMappingURL=is-ios.js.map