import requestToApi from '../../api-requester/request-to-api';
import { productsSearchCache } from '../products-search-cache';
export default function getLeveragedProductAggregateValues(config, aggregatesParams) {
    return requestToApi({
        config,
        url: `${config.productSearchUrl}v5/leverageds/aggregates`,
        params: aggregatesParams,
        cache: productsSearchCache
    });
}
//# sourceMappingURL=get-leveraged-product-aggregate-values.js.map