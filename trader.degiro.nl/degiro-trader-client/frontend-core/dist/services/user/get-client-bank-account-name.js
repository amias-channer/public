const nonIbanCountries = ['GB', 'SE', 'DK'];
export default function getClientBankAccountName(bankAccount, client, options) {
    const { culture = '' } = client;
    const { sortCode = false } = options || {};
    const { iban, number } = bankAccount;
    let result;
    // even GB is in nonIbanCountries it use special conditions
    if (culture === 'GB') {
        result = sortCode ? `${bankAccount.sortCode} / ${number}` : number;
    }
    else if (nonIbanCountries.indexOf(culture) >= 0) {
        // for non-IBAN countries BANK NUMBER has a higher priority
        result = number || iban;
    }
    else {
        // for other countries IBAN has a higher priority
        result = iban || number;
    }
    return result || '';
}
//# sourceMappingURL=get-client-bank-account-name.js.map