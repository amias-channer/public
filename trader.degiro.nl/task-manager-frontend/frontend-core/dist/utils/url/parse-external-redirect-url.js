import parseUrl from './parse-url';
/**
 * @see {@link http://confluence/display/WF/Parsing+and+formatting+data}
 * @param {window.location} location
 * @returns {string}
 */
export default function parseExternalRedirectUrl(location) {
    const { search } = location;
    const redirectParam = '__path';
    // in case of callback redirect from server due to IE9 & Safari 5
    if (search.includes(redirectParam)) {
        const url = parseUrl(location.href);
        let redirectHash = url.query[redirectParam];
        if (redirectHash) {
            const restParams = [];
            const { hasOwnProperty } = Object.prototype;
            const { query } = url;
            for (const key in query) {
                if (hasOwnProperty.call(query, key) && key !== redirectParam) {
                    restParams.push(`${key}=${query[key]}`);
                }
            }
            if (restParams[0] !== undefined) {
                let restParamsSeparator = '?';
                if (redirectHash.includes('?')) {
                    restParamsSeparator = '&';
                }
                redirectHash += restParamsSeparator + restParams.join('&');
            }
            // redirect to url https://domain.com[redirectHash][redirectParam]
            return location.origin + location.pathname + redirectHash;
        }
    }
    return '';
}
//# sourceMappingURL=parse-external-redirect-url.js.map