import createLocaleComparator from '../../../utils/collection/create-locale-comparator';
import getDictionaryCountries from '../../country/get-dictionary-countries';
import getDictionary from '../../dictionary/get-dictionary';
import getExchanges from '../../exchange/get-exchanges';
import getMarketIndices from '../../market-index/get-market-indices';
export default async function getStockCountries(config, client, i18n) {
    const [dictionaryCountries, { stockCountries }, marketIndices, exchanges] = await Promise.all([
        getDictionaryCountries(config, client, i18n),
        getDictionary(config),
        getMarketIndices(config, client),
        getExchanges(config, client)
    ]);
    const countriesInfo = dictionaryCountries.reduce((accum, dictionaryCountry) => {
        accum[dictionaryCountry.id] = dictionaryCountry;
        return accum;
    }, {});
    return stockCountries
        .map((stockCountry) => {
        const countryInfo = countriesInfo[stockCountry.id];
        return {
            ...stockCountry,
            name: (countryInfo === null || countryInfo === void 0 ? void 0 : countryInfo.name) || '',
            label: (countryInfo === null || countryInfo === void 0 ? void 0 : countryInfo.label) || '',
            translation: (countryInfo === null || countryInfo === void 0 ? void 0 : countryInfo.translation) || '',
            exchanges: exchanges.filter(({ id }) => { var _a; return (_a = stockCountry.exchanges) === null || _a === void 0 ? void 0 : _a.includes(id); }),
            indices: marketIndices.filter(({ id }) => { var _a; return (_a = stockCountry.indices) === null || _a === void 0 ? void 0 : _a.includes(id); })
        };
    })
        .sort(createLocaleComparator(client.locale, (country) => country.label));
}
//# sourceMappingURL=get-stock-countries.js.map