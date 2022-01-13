import requestToApi from '../../api-requester/request-to-api';
import { productsSearchCache } from '../products-search-cache';
export default function getOptionAggregateValues(config, aggregatesParams) {
    return requestToApi({
        config,
        url: `${config.productSearchUrl}v5/options/aggregates`,
        params: aggregatesParams,
        cache: productsSearchCache
    });
}
//# sourceMappingURL=get-option-aggregate-values.js.map