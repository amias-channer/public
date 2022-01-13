import getPrimaryCashFunds from './get-primary-cash-funds';
/**
 * @description [WF-1866], [WEB-3894]
 * @param {User} client
 * @param {string} currency
 * @param {number|string} cashFundId
 * @returns {string[]}
 */
export default function getPrimaryCashFundProductIds(client, currency, cashFundId) {
    const cashFunds = getPrimaryCashFunds(client, currency) || [];
    let cashFund = cashFunds[0];
    if (cashFundId || cashFundId === 0) {
        const cashFundIdAsString = String(cashFundId);
        cashFund = cashFunds.find((cashFund) => cashFundIdAsString === String(cashFund.id));
    }
    if (!cashFund || !cashFund.productIds) {
        return [];
    }
    // convert mixed types to strings to prevent errors in .includes() and .indexOf()
    return cashFund.productIds.map((productId) => String(productId));
}
//# sourceMappingURL=get-primary-cash-fund-product-ids.js.map