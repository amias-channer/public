import requestToApi from '../../api-requester/request-to-api';
import prepareProductsSearchRequestParams from '../product/prepare-products-search-request-params';
import prepareProductsSearchResponse from '../product/prepare-products-search-response';
import { productsSearchCache } from '../products-search-cache';
export default function getStocks(config, client, params) {
    return requestToApi({
        config,
        url: `${config.productSearchUrl}v5/stocks`,
        params: prepareProductsSearchRequestParams(params),
        cache: productsSearchCache
    }).then((response) => prepareProductsSearchResponse(config, client, response, params));
}
//# sourceMappingURL=get-stocks.js.map