import flattenQueryParams from './flatten-query-params';
function encode(str) {
    return encodeURIComponent(str)
        .replace(/&/g, '%26')
        .replace(/</g, '%3C')
        .replace(/>/g, '%3E')
        .replace(/\//g, '%2F')
        .replace(/'/g, '%27')
        .replace(/"/g, '%22')
        .replace(/\(/g, '%28')
        .replace(/\)/g, '%29');
}
/**
 * @description {search: "hello", sort: "asc"} => search=hello&sort=asc
 * @param {object} params
 * @returns {string}
 */
export default function getQueryString(params) {
    return Object.entries(flattenQueryParams(params))
        .map(([key, value]) => `${encode(key)}=${encode(value)}`)
        .join('&');
}
//# sourceMappingURL=get-query-string.js.map