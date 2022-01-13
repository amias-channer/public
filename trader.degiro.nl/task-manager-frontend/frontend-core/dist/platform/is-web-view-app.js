/**
 * @description
 *  `window.Ionic` – iOS cordova breadcrumbs, set by https://github.com/ionic-team/cordova-plugin-ionic-webview plugin
 *  `window._cordovaNative` – Android cordova breadcrumbs
 * @returns {boolean}
 */
export default function isWebViewApp() {
    return (typeof window !== 'undefined' &&
        (typeof window.Ionic !== 'undefined' || typeof window._cordovaNative !== 'undefined'));
}
//# sourceMappingURL=is-web-view-app.js.map