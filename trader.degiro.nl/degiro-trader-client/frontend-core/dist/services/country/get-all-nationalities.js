import createLocaleComparator from '../../utils/collection/create-locale-comparator';
export default function getAllNationalities(client, i18n) {
    const nationalities = [];
    const { hasOwnProperty } = Object.prototype;
    for (const key in i18n) {
        if (hasOwnProperty.call(i18n, key) && key.indexOf('dictionary.nationality.') === 0) {
            /**
             * @description last 2 characters. For example: NL
             * @type {string}
             */
            const id = key.slice(-2);
            nationalities.push({
                id,
                label: i18n[key] || ''
            });
        }
    }
    return Promise.resolve(nationalities.sort(createLocaleComparator(client.locale, (country) => country.label)));
}
//# sourceMappingURL=get-all-nationalities.js.map