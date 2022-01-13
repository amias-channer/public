/**
 * Sorts a list of counties alphabetically by label
 *
 * @param {Country[]} countries
 * @param {string | undefined} pinnedCountryCode - country code for a country which should always be on top of the list
 * @returns {Country[]} - the sorted countries array
 */
export default function sortCountriesAlphabeticallyByLabel(countries, pinnedCountryCode) {
    return [...countries].sort((a, b) => {
        return a.id === pinnedCountryCode ? -1 : b.id === pinnedCountryCode ? 1 : a.label < b.label ? -1 : 1;
    });
}
//# sourceMappingURL=sort-countries-alphabetically-by-label.js.map