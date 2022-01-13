import getProductsInfo from './get-products-info';
export default function getProductInfo(config, client, options) {
    const { id } = options;
    return getProductsInfo(config, client, {
        productIds: [id]
    }).then((info) => {
        const productInfo = info[id];
        if (!productInfo) {
            throw new Error(`Product not found. Product id: ${id}`);
        }
        return productInfo;
    });
}
//# sourceMappingURL=get-product-info.js.map