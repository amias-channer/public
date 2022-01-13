import parseUrlSearchParams from '../../utils/url/parse-url-search-params';
const snakeCasePattern = /_[a-zA-Z0-9]/g;
/**
 * @description Collect utm_ params from URL and transform keys to lowerCamelCase notation
 * @returns {UtmParams}
 */
export default function getUtmParamsFromUrl() {
    const urlParams = parseUrlSearchParams(location.search);
    const utmParams = {};
    for (const param in urlParams) {
        if (Object.prototype.hasOwnProperty.call(urlParams, param) && param.indexOf('utm_') === 0) {
            snakeCasePattern.lastIndex = 0;
            utmParams[param.replace(snakeCasePattern, (symbols) => {
                return symbols[1].toUpperCase();
            })] = urlParams[param];
        }
    }
    return utmParams;
}
//# sourceMappingURL=get-utm-params-from-url.js.map