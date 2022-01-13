import plainClone from '../utils/plain-clone';
import isWebViewApp from './is-web-view-app';
export default function getDeviceInfo() {
    if (!isWebViewApp()) {
        return Promise.reject(new Error('Unknown device'));
    }
    return new Promise((resolve, reject) => {
        const { device } = window;
        if (!device) {
            return reject(new Error(`Device info is not available: ${JSON.stringify({
                cordova: typeof window.cordova,
                _cordovaNative: typeof window._cordovaNative,
                Ionic: typeof window.Ionic
            })}`));
        }
        // clone plain object
        const deviceInfo = plainClone(device);
        const { globalization } = navigator;
        if (!globalization) {
            return resolve(deviceInfo);
        }
        globalization.getLocaleName((locale) => {
            deviceInfo.locale = locale.value.replace('-', '_');
            resolve(deviceInfo);
        }, () => {
            resolve(deviceInfo);
        });
    });
}
//# sourceMappingURL=get-device-info.js.map