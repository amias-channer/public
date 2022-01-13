/**
 * @description
 *  Chrome (and some other browsers ignore autocomplete="off" and autocomplete="false")
 *  https://gist.github.com/niksumeiko/360164708c3b326bd1c8#gistcomment-2956701
 *  https://bugs.chromium.org/p/chromium/issues/detail?id=468153#c164
 * @param {string} fieldName
 * @returns {string}
 */
export default function getAutocompleteAttrValue(fieldName) {
    return `new-${fieldName || 'field'}-${Date.now()}`;
}
//# sourceMappingURL=get-autocomplete-attr-value.js.map