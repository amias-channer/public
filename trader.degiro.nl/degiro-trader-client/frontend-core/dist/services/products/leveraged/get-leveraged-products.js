import requestToApi from '../../api-requester/request-to-api';
import prepareProductsSearchRequestParams from '../product/prepare-products-search-request-params';
import prepareProductsSearchResponse from '../product/prepare-products-search-response';
import { productsSearchCache } from '../products-search-cache';
export default async function getLeveragedProducts(config, client, params) {
    const { productSearchUrl } = config;
    const response = await requestToApi({
        config,
        url: `${productSearchUrl}v5/leverageds`,
        params: prepareProductsSearchRequestParams(params),
        cache: productsSearchCache
    });
    return prepareProductsSearchResponse(config, client, response, params);
}
//# sourceMappingURL=get-leveraged-products.js.map