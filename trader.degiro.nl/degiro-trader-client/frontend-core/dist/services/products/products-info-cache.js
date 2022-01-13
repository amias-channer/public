import { logErrorLocally } from '../../loggers/local-logger';
import parseUrlSearchParams from '../../utils/url/parse-url-search-params';
import { getCache } from '../resource-cache/cache-utils';
import ResourceCache from '../resource-cache/index';
import { createExpirableResponse, deleteExpiredResponses, isExpiredCachedResponse } from '../resource-cache/response-utils';
export class ProductsInfoCache extends ResourceCache {
    get() {
        // cached data is available only via #getProductsInfo()
        return Promise.resolve();
    }
    async getProductsInfo(options) {
        const cache = await getCache(this.name);
        const cachedProductsInfo = {};
        const requests = await cache.keys();
        const intAccount = String(options.intAccount);
        const productIds = options.productIds.map((productId) => String(productId));
        const queue = requests.reduce((queue, request) => {
            const requestUrlInfo = new URL(request.url, location.href);
            const { intAccount: intAccountParam, productIds: productIdsParam
            // URL#searchParams prop. is not widely supported
             } = parseUrlSearchParams(requestUrlInfo.search);
            if (intAccountParam !== intAccount) {
                return queue;
            }
            const productIdsByRequest = (productIdsParam || '')
                .split(',')
                .filter((productId) => productIds.includes(productId));
            if (productIdsByRequest.length) {
                queue.push(cache
                    .match(request)
                    .then((response) => {
                    if (response && !isExpiredCachedResponse(response)) {
                        return response.json();
                    }
                })
                    .then((responseModel) => {
                    if (!responseModel) {
                        return;
                    }
                    // BE sends data as flat structure or objects wrapped in `data: {}` structure
                    // see parseApiResponse() also
                    const productsInfo = responseModel.data || responseModel;
                    productIdsByRequest.forEach((productId) => {
                        const productInfo = productsInfo[productId];
                        if (productInfo) {
                            cachedProductsInfo[productInfo.id] = productInfo;
                        }
                    });
                })
                    .catch(logErrorLocally));
            }
            return queue;
        }, []);
        await Promise.all(queue);
        return cachedProductsInfo;
    }
    async set(options) {
        const cacheName = this.name;
        const cache = await getCache(cacheName);
        try {
            // We need to recheck from time to time that cache doesn't have "dead" cached responses.
            // It's better to empty cache/release memory before we put new data
            await deleteExpiredResponses(cache);
        }
        catch (error) {
            logErrorLocally('Failed to delete expired responses', { cacheName, error });
        }
        const { intAccount } = options;
        if (intAccount == null) {
            return;
        }
        const productsInfo = options.parsedResponse;
        const resourceUrlInfo = new URL(options.url, location.href);
        // product info depends on 2 params: intAccount of the client and list of product IDs
        // URL#searchParams prop. is not widely supported
        resourceUrlInfo.search = `?intAccount=${intAccount}&productIds=${Object.keys(productsInfo)}`;
        return cache.put(resourceUrlInfo.href, createExpirableResponse({
            response: options.response,
            minutesTtl: this.minutesTtl
        }));
    }
}
export const productsInfoCache = new ProductsInfoCache({
    name: 'cache-products-info',
    minutesTtl: 20
});
//# sourceMappingURL=products-info-cache.js.map