import {BankBookingSource} from 'frontend-core/dist/models/bank';
import {OrderResult} from './order';

export enum CashOrderTypeIds {
    DIRECT_DEPOSIT = 'DIRECT_DEPOSIT',
    MANUAL_DEPOSIT = 'MANUAL_DEPOSIT',
    WITHDRAWAL = 'WITHDRAWAL'
}

export enum BankBookingSourceIds {
    CASH_FUND_COMPENSATION = 'cfc'
}

export interface CashOrderInfo {
    orderTypeId?: CashOrderTypeIds;
    bookingSourceId?: BankBookingSourceIds | BankBookingSource['id'];
}

export interface UnverifiedBankAccountOrderResult {
    isUnverified: true;
    clientIBAN: string;
    paymentIBAN: string;
}

export type CashOrderResult = UnverifiedBankAccountOrderResult | OrderResult;

export interface ManualTransferRequisite {
    field: string;
    label: string;
    value: string;
}
