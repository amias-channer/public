import createLocaleComparator from '../../utils/collection/create-locale-comparator';
export default function getAllCountries(client, i18n) {
    const countries = [];
    const { hasOwnProperty } = Object.prototype;
    for (const key in i18n) {
        if (hasOwnProperty.call(i18n, key) && key.indexOf('dictionary.country.') === 0) {
            /**
             * @description last 2 characters. For example: NL
             * @type {string}
             */
            const id = key.slice(-2);
            countries.push({
                id,
                label: i18n[key] || ''
            });
        }
    }
    return Promise.resolve(countries.sort(createLocaleComparator(client.locale, (country) => country.label)));
}
//# sourceMappingURL=get-all-countries.js.map