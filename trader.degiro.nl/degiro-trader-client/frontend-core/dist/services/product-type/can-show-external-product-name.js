import { ProductTypeIds } from '../../models/product-type';
/**
 * @description Don't use the product name from external source (VWD):
 *  - for Stocks [TRADER-1837]
 *  - for ETFs [TRADER-1837]
 *  - for CFDs
 *  - for Warrants
 *  - for Options [WEB-2144]
 *  - for Futures [WEB-2185]
 *  - for Leveraged Products
 *  - for Frankfurt exchange
 *  - for exchangeId = 520 and norwegian clients [WF-79]
 * @todo: remove after fixes of the API for names on backend
 * @param {ProductInfo} productInfo
 * @param {User} [user]
 * @returns {boolean}
 */
export default function canShowExternalProductName(productInfo, user) {
    const { productTypeId } = productInfo;
    const exchangeId = Number(productInfo.exchangeId || -1);
    return (productTypeId !== ProductTypeIds.STOCK &&
        productTypeId !== ProductTypeIds.ETF &&
        productTypeId !== ProductTypeIds.CFD &&
        productTypeId !== ProductTypeIds.WARRANT &&
        productTypeId !== ProductTypeIds.LEVERAGED &&
        productTypeId !== ProductTypeIds.OPTION &&
        productTypeId !== ProductTypeIds.FUTURE &&
        exchangeId !== 195 &&
        !(exchangeId === 520 && (user === null || user === void 0 ? void 0 : user.locale) === 'no_NO'));
}
//# sourceMappingURL=can-show-external-product-name.js.map