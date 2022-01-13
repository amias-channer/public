import retryPromise from '../../utils/async/retry-promise';
export default function isCameraPluginSupported() {
    const isDefinedStatus = (status) => status !== undefined;
    const getCameraAuthorizationStatus = () => Promise.race([
        new Promise((resolve, reject) => {
            window.cordova.plugins.diagnostic.getCameraAuthorizationStatus(() => resolve(true), reject);
        }),
        // [CLM-1234] `diagnostic` can be broken and `.getCameraAuthorizationStatus()` can just stuck
        // without any response, so we need a timeout hack to prevent having infinite unresolved promise
        new Promise((resolve) => setTimeout(resolve, 3000))
    ]);
    return retryPromise(getCameraAuthorizationStatus, isDefinedStatus, 3).then(isDefinedStatus);
}
//# sourceMappingURL=is-camera-plugin-supported.js.map