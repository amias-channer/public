import retryPromise from '../../utils/async/retry-promise';
export default function isGeolocationPluginSupported() {
    const isDefinedStatus = (status) => status !== undefined;
    const getLocationAuthorizationStatus = () => Promise.race([
        new Promise((resolve, reject) => {
            window.cordova.plugins.diagnostic.getLocationAuthorizationStatus(() => resolve(true), reject);
        }),
        // [CLM-1234] `diagnostic` can be broken and `.getLocationAuthorizationStatus()` can just stuck
        // without any response, so we need a timeout hack to prevent having infinite unresolved promise
        new Promise((resolve) => setTimeout(resolve, 3000))
    ]);
    return retryPromise(getLocationAuthorizationStatus, isDefinedStatus, 3).then(isDefinedStatus);
}
//# sourceMappingURL=is-geolocation-plugin-supported.js.map