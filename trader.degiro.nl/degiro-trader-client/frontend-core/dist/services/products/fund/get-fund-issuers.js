import requestToApi from '../../api-requester/request-to-api';
import excludeOptionAllParams from '../product/exclude-option-all-params';
import { productsSearchCache } from '../products-search-cache';
export default function getFundIssuers(config, params) {
    return requestToApi({
        config,
        url: `${config.productSearchUrl}v5/funds/issuers`,
        cache: productsSearchCache,
        params: excludeOptionAllParams(params)
    });
}
//# sourceMappingURL=get-fund-issuers.js.map