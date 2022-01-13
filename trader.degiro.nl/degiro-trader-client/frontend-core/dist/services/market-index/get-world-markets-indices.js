import getProductsInfo from '../products/product/get-products-info';
export default function getWorldMarketsIndices(config, client) {
    const { settings } = client;
    const indices = (settings && settings.marketPageIndices) || [];
    if (!indices[0]) {
        return Promise.resolve(indices);
    }
    return getProductsInfo(config, client, {
        productIds: indices.map((indexProduct) => indexProduct.id)
    }).then((data) => {
        const result = [];
        indices.forEach((indexProduct) => {
            const productInfo = data[indexProduct.id];
            if (productInfo) {
                result.push({ ...productInfo, ...indexProduct });
            }
        });
        return result;
    });
}
//# sourceMappingURL=get-world-markets-indices.js.map