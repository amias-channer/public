import parseUrlSearchParams from './parse-url-search-params';
/**
 * @description Parse URL. Takes a URL string, and returns an object.
 * @param {string} url
 * @returns {ParseUrlResult}
 */
export default function parseUrl(url) {
    const urlInfo = new URL(url, location.href);
    const { search, protocol, hostname } = urlInfo;
    return {
        // https://domain.com/
        root: `${protocol}//${hostname}/`,
        hash: urlInfo.hash,
        href: urlInfo.href,
        host: urlInfo.host,
        pathname: urlInfo.pathname,
        origin: urlInfo.origin,
        protocol,
        hostname,
        search,
        query: parseUrlSearchParams(search)
    };
}
//# sourceMappingURL=parse-url.js.map