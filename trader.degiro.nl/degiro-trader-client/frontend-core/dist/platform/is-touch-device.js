export default function isTouchDevice() {
    const documentElement = typeof document !== 'undefined' && document.documentElement;
    return Boolean(documentElement && 'ontouchstart' in documentElement);
}
//# sourceMappingURL=is-touch-device.js.map