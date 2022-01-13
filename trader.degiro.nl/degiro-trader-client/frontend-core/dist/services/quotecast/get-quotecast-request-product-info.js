/**
 * @description Return a model required for quotecast update
 * @see http://confluence/display/WEB/Price+Calculations
 * @param {ProductInfo} productInfo
 * @returns {QuotecastRequestProductInfo}
 */
export default function getQuotecastRequestProductInfo(productInfo) {
    return {
        id: productInfo.id,
        exchangeId: productInfo.exchangeId,
        productTypeId: productInfo.productTypeId,
        closePrice: productInfo.closePrice,
        closePriceDate: productInfo.closePriceDate,
        vwdId: productInfo.vwdId,
        active: productInfo.active
    };
}
//# sourceMappingURL=get-quotecast-request-product-info.js.map