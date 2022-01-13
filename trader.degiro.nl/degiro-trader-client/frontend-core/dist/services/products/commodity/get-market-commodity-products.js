import getProductsInfo from '../product/get-products-info';
export default function getMarketCommodityProducts(config, client) {
    const { settings } = client;
    const commodityProducts = settings === null || settings === void 0 ? void 0 : settings.marketPageCommodities;
    if (!commodityProducts || commodityProducts.length === 0) {
        return Promise.reject(new Error('Market commodity products not found'));
    }
    return getProductsInfo(config, client, {
        productIds: commodityProducts.map((commodityProduct) => commodityProduct.id)
    }).then((productsInfo) => {
        return commodityProducts.reduce((products, commodityProduct) => {
            const productInfo = productsInfo[commodityProduct.id];
            if (productInfo) {
                products.push({
                    ...productInfo,
                    ...commodityProduct
                });
            }
            return products;
        }, []);
    });
}
//# sourceMappingURL=get-market-commodity-products.js.map