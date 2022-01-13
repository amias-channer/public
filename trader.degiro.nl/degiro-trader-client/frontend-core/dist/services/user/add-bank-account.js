import requestToApi from '../api-requester/request-to-api';
export default function addBankAccount(config) {
    return requestToApi({
        config,
        method: 'POST',
        url: `${config.paUrl}bankaccounts/link`
    });
}
//# sourceMappingURL=add-bank-account.js.map