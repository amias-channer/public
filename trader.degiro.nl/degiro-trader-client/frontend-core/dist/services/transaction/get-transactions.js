import formatDate from '../../utils/date/format-date';
import parseDate from '../../utils/date/parse-date';
import requestToApi from '../api-requester/request-to-api';
import getProductsInfo from '../products/product/get-products-info';
export const dateFormat = 'DD/MM/YYYY';
// Sort transaction by 'date', descending
function sortTransactions(first, second) {
    const firstDate = first.date;
    const secondDate = second.date;
    if (firstDate > secondDate) {
        return -1;
    }
    if (firstDate < secondDate) {
        return 1;
    }
    return 0;
}
export default function getTransactions(config, client, params) {
    return requestToApi({
        config,
        url: `${config.reportingUrl}v4/transactions`,
        method: 'GET',
        params: {
            ...params,
            fromDate: formatDate(params.fromDate, dateFormat),
            toDate: formatDate(params.toDate, dateFormat)
        }
    }).then((response) => {
        const productIds = [];
        const transactions = response
            .map((transaction) => {
            const date = transaction.date
                ? parseDate(transaction.date, { keepOriginDate: true })
                : undefined;
            if (transaction.productId != null) {
                productIds.push(String(transaction.productId));
            }
            return {
                ...transaction,
                id: String(transaction.id),
                date: date ? date.toISOString() : ''
            };
        })
            .sort(sortTransactions);
        if (productIds[0] === undefined) {
            return transactions;
        }
        return getProductsInfo(config, client, { productIds }).then((productsInfo) => {
            transactions.forEach((transaction) => {
                transaction.productInfo = productsInfo[transaction.productId];
            });
            return transactions;
        });
    });
}
//# sourceMappingURL=get-transactions.js.map