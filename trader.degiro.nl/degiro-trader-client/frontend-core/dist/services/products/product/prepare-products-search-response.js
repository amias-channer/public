import getExchanges from '../../exchange/get-exchanges';
import sliceProductsFromSearch from './slice-products-from-search';
export default function prepareProductsSearchResponse(config, client, response, requestParams) {
    const { total } = response;
    const { loadExchangeInfo } = requestParams;
    const products = sliceProductsFromSearch(response.products || [], requestParams.offset, requestParams.limit);
    let promise;
    if (loadExchangeInfo && products[0]) {
        promise = getExchanges(config, client).then((exchanges) => {
            products.forEach((productInfo) => {
                const exchangeId = Number(productInfo.exchangeId);
                const exchange = exchanges.find((exchange) => {
                    return exchangeId === exchange.id;
                });
                if (exchange) {
                    productInfo.exchange = exchange;
                }
            });
        });
    }
    else {
        promise = Promise.resolve();
    }
    return promise.then(() => ({
        total,
        data: products
    }));
}
//# sourceMappingURL=prepare-products-search-response.js.map