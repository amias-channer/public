import isTouchDevice from './is-touch-device';
import isWebViewApp from './is-web-view-app';
import isWorker from './is-worker';
/**
 * @description This fn collects a metadata about env. used in several trackers: Sentry, Feedback, etc.
 * @returns {PlatformMetadata}
 */
export default function getPlatformMetadata() {
    const { connection } = navigator;
    // `screen` is not available in Worker
    const screenInfo = typeof screen === 'undefined' ? undefined : screen;
    const orientation = screenInfo === null || screenInfo === void 0 ? void 0 : screenInfo.orientation;
    return {
        screen: screenInfo && {
            availHeight: screenInfo.availHeight,
            height: screenInfo.height,
            availWidth: screenInfo.availWidth,
            width: screenInfo.width,
            colorDepth: screenInfo.colorDepth,
            pixelDepth: screenInfo.pixelDepth,
            orientation: orientation && { angle: orientation.angle, type: orientation.type }
        },
        userAgent: navigator.userAgent,
        deviceMemory: navigator.deviceMemory,
        hardwareConcurrency: navigator.hardwareConcurrency,
        networkInformation: connection && { effectiveType: connection.effectiveType, saveData: connection.saveData },
        isTouchDevice: isTouchDevice(),
        isWorker: isWorker(),
        isApp: isWebViewApp(),
        isStandaloneMode: Boolean(navigator.standalone ||
            (typeof matchMedia === 'function' && matchMedia('(display-mode: standalone)').matches)),
        isWebdriver: navigator.webdriver
    };
}
//# sourceMappingURL=get-platform-metadata.js.map