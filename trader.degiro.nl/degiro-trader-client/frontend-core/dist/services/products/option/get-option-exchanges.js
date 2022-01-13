import createLocaleComparator from '../../../utils/collection/create-locale-comparator';
import getEurexCountries from '../../country/get-eurex-countries';
import getDictionary from '../../dictionary/get-dictionary';
export default async function getOptionExchanges(config, client, i18n) {
    const [{ optionExchanges }, allEurexCountries] = await Promise.all([
        getDictionary(config),
        getEurexCountries(config, client, i18n)
    ]);
    return optionExchanges
        .map((optionExchange) => {
        const eurexCountryIds = optionExchange.eurexCountries;
        let eurexCountries;
        if ((eurexCountryIds === null || eurexCountryIds === void 0 ? void 0 : eurexCountryIds[0]) !== undefined) {
            eurexCountries = allEurexCountries.filter(({ id }) => eurexCountryIds.includes(id));
        }
        return {
            ...optionExchange,
            eurexCountries
        };
    })
        .sort(createLocaleComparator(client.locale, (exchange) => exchange.name));
}
//# sourceMappingURL=get-option-exchanges.js.map