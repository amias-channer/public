import { BankAccountStatuses, BankAccountTypes } from '../../models/bank';
import requestToApi from '../api-requester/request-to-api';
const getBankAccountOrderingWeight = (bankAccount) => {
    let weight = 1;
    if (bankAccount.type === BankAccountTypes.DEPOSIT_AND_WITHDRAWAL) {
        weight *= 3;
    }
    if (bankAccount.status === BankAccountStatuses.VERIFIED) {
        weight *= 2;
    }
    return weight;
};
const compareBankAccounts = (first, second) => {
    return getBankAccountOrderingWeight(second) - getBankAccountOrderingWeight(first);
};
export default function getBankAccounts(config) {
    return requestToApi({
        config,
        url: `${config.paUrl}bankaccounts`
    }).then((bankAccounts = []) => [...bankAccounts].sort(compareBankAccounts));
}
//# sourceMappingURL=get-bank-accounts.js.map