import getDictionary from '../dictionary/get-dictionary';
import getDictionaryCountries from './get-dictionary-countries';
export default function getEurexCountries(config, client, i18n) {
    return Promise.all([getDictionaryCountries(config, client, i18n), getDictionary(config)]).then(([countries, { eurexCountries }]) => {
        const result = [];
        // server can return no data for `eurexCountries`
        if (!eurexCountries) {
            return result;
        }
        countries.forEach((country) => {
            const eurexCountry = eurexCountries.find((eurexCountry) => {
                return eurexCountry.id === country.id;
            });
            if (eurexCountry) {
                result.push({
                    ...eurexCountry,
                    label: country.label,
                    translation: country.translation
                });
            }
        });
        return result;
    });
}
//# sourceMappingURL=get-eurex-countries.js.map