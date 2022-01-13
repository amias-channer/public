import createLocaleComparator from '../../utils/collection/create-locale-comparator';
import getDictionary from '../dictionary/get-dictionary';
export default function getMarketIndices(config, client) {
    return getDictionary(config).then((dictionary) => {
        return dictionary.indices.sort(createLocaleComparator(client.locale, (index) => index.name));
    });
}
//# sourceMappingURL=get-market-indices.js.map