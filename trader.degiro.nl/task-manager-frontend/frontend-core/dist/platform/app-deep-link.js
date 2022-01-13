import { customUrlScheme } from './custom-url-scheme';
/**
 * @see https://github.com/ionic-team/ionic-plugin-deeplinks
 * @returns {void}
 */
export function registerAppDeepLinks() {
    var _a;
    (_a = window.IonicDeeplink) === null || _a === void 0 ? void 0 : _a.onDeepLink(({ url }) => {
        const origin = `${window.location.origin}/`;
        window.location.replace(url
            // [TRADER-1081] support custom URL scheme as well
            .replace(customUrlScheme, origin)
            // [TRADER-1248] BE redirect to custom url scheme might not work (conflict with Deep Links) on Android
            .replace(encodeURIComponent(customUrlScheme), encodeURIComponent(origin)));
    });
}
//# sourceMappingURL=app-deep-link.js.map