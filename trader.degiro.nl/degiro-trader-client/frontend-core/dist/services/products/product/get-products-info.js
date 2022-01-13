import { logErrorLocally } from '../../../loggers/local-logger';
import requestToApi from '../../api-requester/request-to-api';
import getExchange from '../../exchange/get-exchange';
import isExchangeIdValid from '../../exchange/is-exchange-id-valid';
import { productsInfoCache } from '../products-info-cache';
export default function getProductsInfo(config, client, options) {
    let totalProductsInfo = {};
    const { productIds } = options;
    const productsInfoUrl = `${config.productSearchUrl}v5/products/info`;
    const processCachedProductsInfo = (cachedProductsInfo) => {
        // add data from the cache to result
        totalProductsInfo = { ...cachedProductsInfo };
        const productIdsToFetch = productIds.reduce((productIds, productId) => {
            const productIdAsStr = String(productId);
            // 1. Check we do not get product info already from the cache
            // 2. [WF-2690] API doesn't accept duplicate IDs
            if (!totalProductsInfo[productIdAsStr] && !productIds.includes(productIdAsStr)) {
                productIds.push(productIdAsStr);
            }
            return productIds;
        }, []);
        if (productIdsToFetch.length) {
            return requestToApi({
                config,
                url: productsInfoUrl,
                method: 'POST',
                body: productIdsToFetch,
                cache: productsInfoCache
            });
        }
    };
    const processFetchedProductsInfo = (fetchedProductsInfo) => {
        // add fetched data to result (additionally to cached one)
        totalProductsInfo = {
            ...totalProductsInfo,
            ...fetchedProductsInfo
        };
        const queue = productIds.reduce((queue, productId) => {
            const productInfo = totalProductsInfo[productId];
            if (productInfo) {
                totalProductsInfo[productId] = productInfo;
                const { exchangeId } = productInfo;
                // Load Exchange info to sort the products in tables
                if (isExchangeIdValid(exchangeId)) {
                    queue.push(getExchange(config, client, { id: exchangeId })
                        .catch((error) => {
                        // always resolve, because it's not a most important info for product and
                        // we can work without it
                        logErrorLocally(error, { exchangeId, productInfo });
                        return undefined;
                    })
                        .then((exchange) => {
                        productInfo.exchange = exchange;
                    }));
                }
            }
            return queue;
        }, []);
        return Promise.all(queue);
    };
    return productsInfoCache
        .getProductsInfo({
        intAccount: config.intAccount,
        productIds
    })
        .catch(logErrorLocally)
        .then(processCachedProductsInfo)
        .then(processFetchedProductsInfo)
        .then(() => totalProductsInfo);
}
//# sourceMappingURL=get-products-info.js.map