export default function setCookiesParams(params, options) {
    const { maxAge } = options;
    Object.entries(params).forEach(([param, value]) => {
        document.cookie = `${param}=${value || ''}; max-age=${maxAge}; path=/`;
    });
}
//# sourceMappingURL=set-cookies-params.js.map