import getProductsInfo from '../products/product/get-products-info';
export default function getMarketCurrencies(config, currentClient) {
    const { settings } = currentClient;
    const currencyProducts = settings && settings.marketPageCurrencies;
    if (!currencyProducts) {
        return Promise.reject(new Error('Market currencies not found'));
    }
    return getProductsInfo(config, currentClient, {
        productIds: currencyProducts.map((productInfo) => productInfo.id)
    }).then((data) => {
        const result = [];
        currencyProducts.forEach((currencyProduct) => {
            const productInfo = data[currencyProduct.id];
            if (productInfo) {
                result.push({ ...productInfo, ...currencyProduct });
            }
        });
        return result;
    });
}
//# sourceMappingURL=get-market-currencies.js.map