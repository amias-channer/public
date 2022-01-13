import isWebViewApp from '../is-web-view-app';
import openInAppBrowser from './open-in-app-browser';
function hasAttributeGetter(target) {
    return typeof target.getAttribute === 'function';
}
function getHref(target) {
    return (target && hasAttributeGetter(target) && target.getAttribute('href')) || undefined;
}
/**
 * @description Open external links in WebView app: span[href], a[href]. It doesn't apply to internal #/ links
 * @param {Event|React.MouseEvent<Element>} event
 * @returns {void}
 */
export default function onExternalLinkClick(event) {
    const href = getHref(event.target) || getHref(event.currentTarget);
    if (href && isWebViewApp()) {
        event.preventDefault();
        openInAppBrowser({ url: href, target: '_system' });
    }
}
//# sourceMappingURL=on-external-link-click.js.map