import setCookiesParams from '../cookies/set-cookies-params';
import getUtmParamsFromUrl from './get-utm-params-from-url';
/**
 * @description [WF-2081]: Save Analytics params from the URL in cookies
 * @returns {void}
 */
export default function saveUtmParams() {
    const utmParams = getUtmParamsFromUrl();
    setCookiesParams(utmParams, {
        maxAge: 30 * 24 * 60 * 60
    });
}
//# sourceMappingURL=save-utm-params.js.map