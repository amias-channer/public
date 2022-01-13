import requestToApi from '../../api-requester/request-to-api';
import { productsSearchCache } from '../products-search-cache';
import prepareProductsSearchRequestParams from './prepare-products-search-request-params';
import prepareProductsSearchResponse from './prepare-products-search-response';
export default function getProducts(config, client, params) {
    return requestToApi({
        config,
        url: `${config.productSearchUrl}v5/products/lookup`,
        params: prepareProductsSearchRequestParams(params),
        cache: productsSearchCache
    }).then((response) => prepareProductsSearchResponse(config, client, response, params));
}
//# sourceMappingURL=get-products.js.map