export function isSharingAvailable() {
    var _a;
    return Boolean(typeof navigator.share === 'function' || Boolean((_a = window.plugins) === null || _a === void 0 ? void 0 : _a.socialsharing));
}
export function share(options) {
    var _a;
    const socialsharing = (_a = window.plugins) === null || _a === void 0 ? void 0 : _a.socialsharing;
    if (socialsharing) {
        return new Promise((resolve, reject) => {
            socialsharing.shareWithOptions({
                subject: options.title,
                url: options.url,
                message: options.text
            }, () => resolve(), (message) => reject(new Error(message)));
        });
    }
    if (typeof navigator.share === 'function') {
        return navigator.share(options);
    }
    return Promise.reject(new Error('ShareAPI is not available'));
}
//# sourceMappingURL=share.js.map