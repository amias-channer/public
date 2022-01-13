const mobileUserAgentPattern = new RegExp([
    'mobi',
    'ipod',
    'phone',
    'blackberry',
    'opera mini',
    'fennec',
    'minimo',
    'symbian',
    'psp',
    'nintendo ds',
    'archos',
    'skyfire',
    'puffin',
    'blazer',
    'bolt',
    'gobrowser',
    'iris',
    'maemo',
    'semc',
    'teashark',
    'uzard'
].join('|'));
/**
 * @deprecated
 * @returns {boolean}
 */
export default function isPhone() {
    return mobileUserAgentPattern.test(navigator.userAgent.toLowerCase());
}
//# sourceMappingURL=is-phone.js.map