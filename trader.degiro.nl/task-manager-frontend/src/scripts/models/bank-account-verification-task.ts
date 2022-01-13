import {BankAccountInfo, UserBankAccount} from 'frontend-core/dist/models/bank';

export enum BankAccountVerificationMethods {
    DIRECT = 'DIRECT_ONLINE_TRANSFER',
    MANUAL = 'MANUAL_WIRE_TRANSFER'
}
export type BankAccountVerificationMethod =
    | BankAccountVerificationMethods.DIRECT
    | BankAccountVerificationMethods.MANUAL;

export enum BankAccountVerificationTargets {
    CLIENT_VERIFICATION = 'CLIENT_VERIFICATION',
    NEW_BANK_ACCOUNT = 'NEW_BANK_ACCOUNT'
}
export type BankAccountVerificationTarget =
    | BankAccountVerificationTargets.CLIENT_VERIFICATION
    | BankAccountVerificationTargets.NEW_BANK_ACCOUNT;

/**
 * @readonly
 * @type {string[]}
 */
export const bankAccountFields: (keyof Pick<BankAccountInfo, 'iban' | 'sortCode' | 'number'>)[] = [
    'iban',
    'sortCode',
    'number'
];

export interface BankAccountVerificationTaskInfo {
    bankAccount: UserBankAccount;
    method?: BankAccountVerificationMethod;
    target?: BankAccountVerificationTarget;
}

export interface DirectTransferFormData {
    amount?: number;
    issuer?: string;
}
