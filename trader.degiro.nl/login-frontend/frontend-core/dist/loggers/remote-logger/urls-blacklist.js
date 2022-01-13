import { ignoreUrls } from 'ravenjs-ignores';
export default ignoreUrls.concat([
    // ignore dev hosts
    /\d+\.\d+\.\d+\.\d+|localhost/i,
    // ignore internal hosts
    /(test|internal)\.degiro/i,
    // Google Tag Manager
    /\/gtm\.js/,
    /bootstrapnet\./,
    // vozmerix.info
    /vozmerix\./,
    /dekos\.js/,
    // Adguard
    /adguard-ajax-api/,
    // Chrome extensions
    /chrome-extension:/,
    // Firefox extensions
    /moz-extension:/,
    // Safari extensions
    /safari-extension:/,
    // "myshopcouponmac" ad/malware
    /myshopcouponmac/,
    /workdevapp\.com/
]);
//# sourceMappingURL=urls-blacklist.js.map