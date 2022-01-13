import parseDate from '../../utils/date/parse-date';
/**
 * @description Server may return an empty response,
 *  https://sentry.io/degiro-bv/degiro-mobile-frontend/issues/821315728/
 * @param {Partial<AccountOverviewResponse>} accountOverview
 * @returns {AccountOverview}
 */
export default function prepareAccountOverview(accountOverview) {
    const { cashMovements = [] } = accountOverview;
    const handledCurrencies = {};
    const productIds = [];
    const existingProductIds = Object.create(null);
    let productIdsCount = 0;
    const movements = cashMovements.map((originCashMovement, index) => {
        const { currency, orderId, productId } = originCashMovement;
        const cashMovement = Object.assign({}, originCashMovement, {
            id: String(index),
            // don't use invalid value
            orderId: orderId === 'NULL' ? '' : orderId,
            parsedDate: parseDate(originCashMovement.date, { keepOriginDate: true }),
            parsedValueDate: parseDate(originCashMovement.valueDate, { keepOriginDate: true })
        });
        handledCurrencies[currency] = 1;
        if (productId != null && existingProductIds[productId] !== 1) {
            existingProductIds[productId] = 1;
            productIds[productIdsCount] = productId;
            productIdsCount++;
        }
        return cashMovement;
    });
    return {
        currencies: Object.keys(handledCurrencies),
        cashMovements: movements,
        productIds
    };
}
//# sourceMappingURL=prepare-account-overview.js.map