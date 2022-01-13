export enum AccountType {
  LocalAu,
  LocalUs,
  LocalCa,
  Swift,
  Local,
}

export enum AccountDetailProperty {
  accountNumber = 'accountNumber',
  achRoutingNumber = 'achRoutingNumber',
  bankCode = 'bankCode',
  bankName = 'bankName',
  beneficiaryName = 'beneficiaryName',
  bic = 'bic',
  bsb = 'bsb',
  iban = 'iban',
  institutionNumber = 'institutionNumber',
  requiredReference = 'requiredReference',
  sortCode = 'sortCode',
  transitNumber = 'transitNumber',
}

export enum RevolutBankAccountNote {
  FEES = 'fees',
  TIME = 'time',
  IBAN = 'iban',
}

export const ACCOUNT_FIELDS_BY_TYPE = {
  [AccountType.LocalAu]: [AccountDetailProperty.accountNumber, AccountDetailProperty.bsb],
  [AccountType.LocalUs]: [
    AccountDetailProperty.accountNumber,
    AccountDetailProperty.achRoutingNumber,
  ],
  [AccountType.LocalCa]: [
    AccountDetailProperty.accountNumber,
    AccountDetailProperty.transitNumber,
    AccountDetailProperty.institutionNumber,
  ],
  [AccountType.Swift]: [
    AccountDetailProperty.accountNumber,
    AccountDetailProperty.iban,
    AccountDetailProperty.bic,
    AccountDetailProperty.bankCode,
  ],
  [AccountType.Local]: [
    AccountDetailProperty.accountNumber,
    AccountDetailProperty.sortCode,
    AccountDetailProperty.bankCode,
    AccountDetailProperty.bankName,
  ],
}
