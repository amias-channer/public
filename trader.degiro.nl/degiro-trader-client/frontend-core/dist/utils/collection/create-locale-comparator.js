/**
 * @param {string|undefined} locale – nl_NL, de_DE
 * @param {Function} mapFn
 * @returns {Function}
 */
export default function createLocaleComparator(locale, mapFn) {
    const collator = new Intl.Collator(locale === null || locale === void 0 ? void 0 : locale.replace('_', '-'));
    return (a, b) => collator.compare(mapFn(a), mapFn(b));
}
//# sourceMappingURL=create-locale-comparator.js.map