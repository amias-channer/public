import createLocaleComparator from '../../utils/collection/create-locale-comparator';
import getDictionary from '../dictionary/get-dictionary';
export default function getExchanges(config, client) {
    return getDictionary(config).then((dictionary) => {
        const exchanges = dictionary.exchanges.map((exchange) => {
            exchange.label = exchange.name;
            return exchange;
        });
        return exchanges.sort(createLocaleComparator(client.locale, (exchange) => String(exchange.label)));
    });
}
//# sourceMappingURL=get-exchanges.js.map