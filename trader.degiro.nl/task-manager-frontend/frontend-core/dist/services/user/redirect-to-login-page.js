import getQueryString from '../../utils/url/get-query-string';
export default function redirectToLoginPage(config, options) {
    const { loginUrl } = config;
    const params = {
        // [TRADER-1379] BE supports a navigation to a target page via `redirectUrl` query param
        redirectUrl: window.location.href,
        ...options === null || options === void 0 ? void 0 : options.params
    };
    window.location.replace(loginUrl + (loginUrl.includes('?') ? '&' : '?') + getQueryString(params));
}
//# sourceMappingURL=redirect-to-login-page.js.map