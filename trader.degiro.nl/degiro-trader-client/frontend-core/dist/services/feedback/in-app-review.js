export function isInAppReviewSupported() {
    var _a;
    return typeof ((_a = window.inappreview) === null || _a === void 0 ? void 0 : _a.requestReview) === 'function';
}
export function requestInAppReview() {
    if (!isInAppReviewSupported()) {
        return Promise.reject(new Error('InApp reviews are not supported'));
    }
    return new Promise((resolve, reject) => window.inappreview.requestReview(resolve, reject));
}
//# sourceMappingURL=in-app-review.js.map