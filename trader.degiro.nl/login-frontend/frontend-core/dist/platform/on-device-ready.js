import isTouchDevice from './is-touch-device';
/**
 * @returns {Promise}
 */
export default function onDeviceReady() {
    // 1. if this fn called in background thread we should exit
    // 2. if it's not a touch device, there is no need to try to find Cordova API (speed improvement on desktop)
    if (typeof window === 'undefined' || !isTouchDevice()) {
        return Promise.resolve();
    }
    return new Promise((resolve) => {
        // create an async task in the event loop for iOS,
        // because Cordova API will "appear" only after current script execution
        setTimeout(() => {
            let checkingAttempts = 0;
            // [WF-1950]: on Android 5.x-6.x we should wait longer
            const maxCheckingAttempts = 100;
            const onDeviceReadyEvent = () => {
                document.removeEventListener('deviceready', onDeviceReadyEvent, false);
                resolve();
            };
            const onWebViewEngineReady = () => {
                if (window.device) {
                    onDeviceReadyEvent();
                }
                else {
                    document.addEventListener('deviceready', onDeviceReadyEvent, false);
                }
            };
            const checkWebViewEngine = () => {
                if (window.cordova) {
                    return onWebViewEngineReady();
                }
                // if we haven't found even Cordova breadcrumbs, we shouldn't wait for 'window.cordova' object
                if (!window.Ionic && !window._cordovaNative) {
                    return resolve();
                }
                checkingAttempts++;
                // if we don't have Cordova breadcrumbs - just make several attempts
                if (checkingAttempts === maxCheckingAttempts) {
                    // resolve as it's not a WebView
                    return resolve();
                }
                // continue checking every 300ms
                setTimeout(checkWebViewEngine, 300);
            };
            checkWebViewEngine();
        }, 0);
    });
}
//# sourceMappingURL=on-device-ready.js.map