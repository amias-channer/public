import getProductsInfo from '../product/get-products-info';
export default async function getMarketFutures(config, client) {
    const { settings } = client;
    const futureProducts = settings === null || settings === void 0 ? void 0 : settings.marketPageFutures;
    if (!futureProducts) {
        return Promise.reject(new Error('Market futures not found'));
    }
    const productsInfo = await getProductsInfo(config, client, {
        productIds: futureProducts.map((futureProduct) => futureProduct.id)
    });
    return futureProducts.reduce((accum, futureProduct) => {
        const productInfo = productsInfo[futureProduct.id];
        if (productInfo) {
            accum.push({ ...productInfo, ...futureProduct });
        }
        return accum;
    }, []);
}
//# sourceMappingURL=get-market-futures.js.map