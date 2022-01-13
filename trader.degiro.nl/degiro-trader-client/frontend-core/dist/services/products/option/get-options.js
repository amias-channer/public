import requestToApi from '../../api-requester/request-to-api';
import prepareProductsSearchRequestParams from '../product/prepare-products-search-request-params';
import sliceProductsFromSearch from '../product/slice-products-from-search';
import { productsSearchCache } from '../products-search-cache';
export default async function getOptions(config, params) {
    const response = await requestToApi({
        config,
        url: `${config.productSearchUrl}v5/options`,
        params: prepareProductsSearchRequestParams(params),
        cache: productsSearchCache
    });
    return {
        total: response.total,
        data: sliceProductsFromSearch(response.products || [], params.offset, params.limit)
    };
}
//# sourceMappingURL=get-options.js.map