export const customUrlScheme = 'nl.degiro.trader://';
/**
 * @description We need to support custom URL scheme instead of deep linking only as it's used in the cash orders.
 *  Plus not all our clients have an app version with deep link implementation (iOS/Android app v2.4.0+)
 * @see {@link https://github.com/EddyVerbruggen/Custom-URL-scheme}
 */
export function addCustomUrlListener() {
    window.handleOpenURL = function (url) {
        const redirectUrl = url && url.split(customUrlScheme)[1];
        if (redirectUrl) {
            window.location.replace(`/${redirectUrl}`);
        }
    };
}
//# sourceMappingURL=custom-url-scheme.js.map