/**
 * @description [WF-2407] on iOS whe keyboard disappears WebView doesn't not resize to its previous position
 *  See related Cordova.js issues
 *  https://issues.apache.org/jira/browse/CB-4862
 *  https://issues.apache.org/jira/browse/CB-5852
 *  https://github.com/cjpearson/cordova-plugin-keyboard/issues/62
 * @returns {void}
 */
import isIOS from './is-ios';
import isWebViewApp from './is-web-view-app';
export default function addIosWebViewPositionFix() {
    if (!isWebViewApp() || !isIOS()) {
        return;
    }
    let frameId;
    document.addEventListener('focusout', () => {
        cancelAnimationFrame(frameId);
        frameId = requestAnimationFrame(() => {
            const { body } = document;
            window.scrollTo(body.scrollLeft, body.scrollTop);
        });
    }, false);
}
//# sourceMappingURL=add-ios-webview-position-fix.js.map