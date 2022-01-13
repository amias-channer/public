/**
 * @description [WF-1866], [WEB-3894]
 * @param {User} client
 * @param {string} currency
 * @returns {UserCashFund[]|undefined}
 */
export default function getPrimaryCashFunds(client, currency) {
    var _a, _b;
    return (_b = (_a = client.accountInfo) === null || _a === void 0 ? void 0 : _a.cashFunds) === null || _b === void 0 ? void 0 : _b[currency];
}
//# sourceMappingURL=get-primary-cash-funds.js.map