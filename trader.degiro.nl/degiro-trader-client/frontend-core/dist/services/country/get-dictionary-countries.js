import createLocaleComparator from '../../utils/collection/create-locale-comparator';
import getDictionary from '../dictionary/get-dictionary';
import localize from '../i18n/localize';
export default async function getDictionaryCountries(config, client, i18n) {
    const dictionary = await getDictionary(config);
    const translatedCountries = dictionary.countries.map((country) => ({
        ...country,
        label: localize(i18n, country.translation || '')
    }));
    return translatedCountries.sort(createLocaleComparator(client.locale, (country) => country.label));
}
//# sourceMappingURL=get-dictionary-countries.js.map