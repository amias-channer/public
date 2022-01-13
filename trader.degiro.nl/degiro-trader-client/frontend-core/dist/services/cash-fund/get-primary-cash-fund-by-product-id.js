import getPrimaryCashFunds from './get-primary-cash-funds';
/**
 * @description [WF-1866], [WEB-3894]
 * @param {User} client
 * @param {string} currency
 * @param {number|string} productId
 * @returns {UserCashFund|undefined}
 */
export default function getPrimaryCashFundByProductId(client, currency, productId) {
    const cashFunds = getPrimaryCashFunds(client, currency) || [];
    const productIdAsString = String(productId);
    return cashFunds.find(({ productIds = [] }) => {
        return productIds.some((cashFundProductId) => {
            return productIdAsString === String(cashFundProductId);
        });
    });
}
//# sourceMappingURL=get-primary-cash-fund-by-product-id.js.map