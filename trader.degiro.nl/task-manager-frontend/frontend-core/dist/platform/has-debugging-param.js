import parseUrlSearchParams from '../utils/url/parse-url-search-params';
/**
 * @description This method helps to check global debugging params (see DebuggingParams) passed via URL
 * @example
 *  URL: https://app.com?debugParam=foo
 *  hasDebuggingParam('debugParam') checks that 'debugParam' exists in URL
 *  hasDebuggingParam('debugParam', 'foo') checks that 'debugParam' is equal to 'foo'
 * @param {DebuggingParams} param
 * @param {string} [equalTo]
 * @returns {boolean}
 */
export default function hasDebuggingParam(param, equalTo) {
    const searchParams = parseUrlSearchParams(location.search);
    if (equalTo) {
        return searchParams[param] === equalTo;
    }
    return param in searchParams;
}
//# sourceMappingURL=has-debugging-param.js.map