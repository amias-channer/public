import parseUrl from './parse-url';
import getQueryString from './get-query-string';
export default function cleanupUrl(props) {
    const { ignoredSearchParams, ignoredPathSegments = [] } = props;
    // Since URL and URL#searchParams are not widely supported, we have to use a custom parser
    const urlInfo = parseUrl(props.url);
    const allSearchParams = urlInfo.query;
    const cleanedSearchParams = {};
    const pathSegmentsSeparator = ';';
    for (const param in allSearchParams) {
        if (Object.prototype.hasOwnProperty.call(allSearchParams, param) && !ignoredSearchParams.includes(param)) {
            cleanedSearchParams[param] = allSearchParams[param];
        }
    }
    urlInfo.pathname = urlInfo.pathname
        .split(pathSegmentsSeparator)
        .filter((segment) => {
        const [key] = segment.split('=');
        return !ignoredPathSegments.includes(key);
    })
        .join(pathSegmentsSeparator);
    return `${urlInfo.origin}${urlInfo.pathname}?${getQueryString(cleanedSearchParams)}${urlInfo.hash}`;
}
//# sourceMappingURL=cleanup-url.js.map