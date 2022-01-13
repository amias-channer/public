/**
 * @example In our apps site locale can be used in Login and Registration as
 *  /login/nl
 *  /login/befr
 *  /registration/befr
 */
const localesData = new Map([
    ['nl', { language: 'nl', country: 'NL' }],
    ['benl', { language: 'nl', country: 'BE' }],
    ['befr', { language: 'fr', country: 'BE' }],
    ['fr', { language: 'fr', country: 'FR' }],
    ['de', { language: 'de', country: 'DE' }],
    ['at', { language: 'de', country: 'AT' }],
    ['uk', { language: 'en', country: 'GB' }],
    ['cz', { language: 'cs', country: 'CZ' }],
    ['pl', { language: 'pl', country: 'PL' }],
    ['es', { language: 'es', country: 'ES' }],
    ['pt', { language: 'pt', country: 'PT' }],
    ['gr', { language: 'el', country: 'GR' }],
    ['hu', { language: 'hu', country: 'HU' }],
    ['it', { language: 'it', country: 'IT' }],
    ['dk', { language: 'da', country: 'DK' }],
    ['se', { language: 'sv', country: 'SE' }],
    ['no', { language: 'no', country: 'NO' }],
    ['fifi', { language: 'fi', country: 'FI' }],
    ['fi', { language: 'fi', country: 'FI' }],
    ['ie', { language: 'en', country: 'IE' }],
    ['chde', { language: 'de', country: 'CH' }],
    ['chfr', { language: 'fr', country: 'CH' }],
    ['chit', { language: 'it', country: 'CH' }],
    ['chen', { language: 'en', country: 'CH' }]
]);
export const siteLocales = [...localesData.keys()];
export function getLocaleData(siteLocale) {
    return localesData.get(siteLocale);
}
export function getSiteLocale(country, language) {
    for (const [siteLocale, localeData] of localesData.entries()) {
        if (localeData.country === country && localeData.language === language) {
            return siteLocale;
        }
    }
}
//# sourceMappingURL=site-locale.js.map