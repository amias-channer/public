/**
 * @see {@link http://confluence/display/WF/Parsing+and+formatting+data}
 * @param {string|undefined} search
 * @returns {Object.<string, string>}
 */
export default function parseUrlSearchParams(search) {
    return !search
        ? {}
        : search
            .replace(/^\?/, '')
            .split('&')
            .reduce((query, pair) => {
            const [key, value] = pair.split('=');
            if (key) {
                /**
                 * https://sentry.io/organizations/degiro-bv/issues/965390847
                 * Should handle URI malformed params, e.g. '?searchText=Seaspan%20Corp-6.375%%20Notes'
                 */
                try {
                    query[key] = value ? decodeURIComponent(value) : '';
                }
                catch (_a) {
                    //
                }
            }
            return query;
        }, {});
}
//# sourceMappingURL=parse-url-search-params.js.map