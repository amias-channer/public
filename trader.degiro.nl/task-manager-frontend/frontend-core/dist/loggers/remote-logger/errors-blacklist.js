import { ignoreErrors } from 'ravenjs-ignores';
export default ignoreErrors.concat([
    // Network errors such as going offline or being blocked by a proxy
    'Failed to fetch',
    // we don't use jQuery
    'jQuery',
    // we don't use Angular
    'angular',
    // bootstrapnet.space
    'BetterJsPop',
    // exclude junk errors
    'status":403',
    'status":401',
    'status":-1',
    'Status 0',
    'Service Worker Response Error',
    // 'Status 401 ' in different languages
    ' 401 ',
    'cordova already defined',
    // Firefox warnings, https://sentry.io/degiro-bv/degiro-trader-frontend/issues/348952727/
    '[[Prototype]]',
    // Cordova.js warning
    "Can't find variable: cordova",
    // Google Tag Manager
    '/gtm.js',
    // Highcharts.js errors in VWD template.js
    'Highcharts error #',
    // MetaMask extension
    'MetaMask',
    'actextdev.',
    'linkgolock.',
    'institute.get',
    'csRestoreTitle',
    'GM_',
    'ztePageScrollModule',
    'shoppytoolmac',
    '_controlUniqueID',
    // workdevapp.com
    '/ext/',
    '/jscache/',
    // Chrome extensions
    'chrome-extension:/',
    // Firefox extensions
    '/moz-extension:/',
    // Safari extensions
    'safari-extension:/'
]);
//# sourceMappingURL=errors-blacklist.js.map