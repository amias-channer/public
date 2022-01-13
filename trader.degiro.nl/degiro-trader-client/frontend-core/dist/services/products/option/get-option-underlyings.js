import createLocaleComparator from '../../../utils/collection/create-locale-comparator';
import requestToApi from '../../api-requester/request-to-api';
import { productsSearchCache } from '../products-search-cache';
// OMX exchange
const omxExchangeId = 7;
export default async function getOptionUnderlyings(config, client, params) {
    const { optionExchangeId } = params;
    const underlyings = await requestToApi({
        config,
        url: `${config.productSearchUrl}v5/options/underlyings`,
        params,
        cache: productsSearchCache
    });
    return underlyings
        .map((underlying) => ({
        ...underlying,
        // Underlyings don't have `id` property, so set identifier for correct work with item.
        id: underlying.isin,
        label: optionExchangeId === omxExchangeId ? underlying.name : `${underlying.symbol} (${underlying.name})`
    }))
        .sort(createLocaleComparator(client.locale, (underlying) => underlying.label));
}
//# sourceMappingURL=get-option-underlyings.js.map