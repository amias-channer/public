import requestToApi from '../../api-requester/request-to-api';
import prepareProductsSearchRequestParams from '../product/prepare-products-search-request-params';
import prepareProductsSearchResponse from '../product/prepare-products-search-response';
import { productsSearchCache } from '../products-search-cache';
export default async function getEtfs(config, client, params) {
    const response = await requestToApi({
        config,
        url: `${config.productSearchUrl}v5/etfs`,
        params: prepareProductsSearchRequestParams(params),
        cache: productsSearchCache
    });
    return prepareProductsSearchResponse(config, client, response, params);
}
//# sourceMappingURL=get-etfs.js.map