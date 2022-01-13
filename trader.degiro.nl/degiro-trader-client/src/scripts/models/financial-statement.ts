export enum StatementTypes {
    BALANCE = 'BAL',
    CASH_FLOW = 'CAS',
    INCOME = 'INC'
}

export enum StatementPeriodTypes {
    QUARTER = 'interim',
    YEAR = 'annual'
}

export type IncomeStatementCode =
    | 'SREV'
    | 'SPRE'
    | 'RNII'
    | 'RRGL'
    | 'SIIB'
    | 'SORE'
    | 'RTLR'
    | 'SCOR'
    | 'SGRP'
    | 'EFEX'
    | 'EDOE'
    | 'STIE'
    | 'ENII'
    | 'ELLP'
    | 'SIAP'
    | 'SLBA'
    | 'EPAC'
    | 'SSGA'
    | 'ERAD'
    | 'SDPR'
    | 'SINN'
    | 'SUIE'
    | 'SOOE'
    | 'ETOE'
    | 'SOPI'
    | 'SNIN'
    | 'NGLA'
    | 'NAFC'
    | 'SNII'
    | 'SNIE'
    | 'SONT'
    | 'EIBT'
    | 'TTAX'
    | 'TIAT'
    | 'CMIN'
    | 'CEIA'
    | 'CGAP'
    | 'NIBX'
    | 'STXI'
    | 'NINC'
    | 'SANI'
    | 'CIAC'
    | 'XNIC'
    | 'SDAJ'
    | 'SDNI'
    | 'SDWS'
    | 'SDBF'
    | 'DDPS1'
    | 'VDES';

export type BalanceSheetStatementCode =
    | 'ACSH'
    | 'ACAE'
    | 'ASTI'
    | 'SCSI'
    | 'AACR'
    | 'ATRC'
    | 'AITL'
    | 'APPY'
    | 'SOCA'
    | 'ATCA'
    | 'ACDB'
    | 'SOEA'
    | 'ANTL'
    | 'APTC'
    | 'ADEP'
    | 'APPN'
    | 'AGWI'
    | 'AINT'
    | 'SUPN'
    | 'SINV'
    | 'APRE'
    | 'ALTR'
    | 'SOLA'
    | 'ADPA'
    | 'SOAT'
    | 'ATOT'
    | 'LAPB'
    | 'LPBA'
    | 'LAEX'
    | 'SPOL'
    | 'LDBT'
    | 'SOBL'
    | 'LSTB'
    | 'LSTD'
    | 'LCLD'
    | 'SOCL'
    | 'LTCL'
    | 'LLTD'
    | 'LCLO'
    | 'LTTD'
    | 'STLD'
    | 'SBDT'
    | 'LMIN'
    | 'SLTL'
    | 'LTLL'
    | 'SRPR'
    | 'SPRS'
    | 'SCMS'
    | 'QPIC'
    | 'QRED'
    | 'QTSC'
    | 'QEDG'
    | 'QUGL'
    | 'SOTE'
    | 'QTLE'
    | 'QTEL'
    | 'QTCO'
    | 'QTPO';

export type CashFlowStatementCode =
    | 'ONET'
    | 'SDED'
    | 'SAMT'
    | 'OBDT'
    | 'SNCI'
    | 'OCRC'
    | 'OCPD'
    | 'SCTP'
    | 'SCIP'
    | 'SOCF'
    | 'OTLO'
    | 'SCEX'
    | 'SICF'
    | 'ITLI'
    | 'SFCF'
    | 'FCDP'
    | 'FPSS'
    | 'FPRD'
    | 'FTLF'
    | 'SFEE'
    | 'SNCC';

export type StatementCode = IncomeStatementCode | BalanceSheetStatementCode | CashFlowStatementCode;

interface StatementItem<Codes> {
    code: Codes;
    meaning: string;
    value: number;
}

export type IncomeStatementItem = StatementItem<IncomeStatementCode>;

export type BalanceSheetStatementItem = StatementItem<BalanceSheetStatementCode>;

export type CashFlowStatementItem = StatementItem<CashFlowStatementCode>;

interface BaseFinancialStatement<T, Item> {
    type: T;
    periodLength: number;
    source: string;
    periodType: string;
    items: Item[];
}

export type IncomeStatement = BaseFinancialStatement<StatementTypes.INCOME, IncomeStatementItem>;
export type BalanceSheetStatement = BaseFinancialStatement<StatementTypes.BALANCE, BalanceSheetStatementItem>;
export type CashFlowStatement = BaseFinancialStatement<StatementTypes.CASH_FLOW, CashFlowStatementItem>;

export type FinancialStatement = IncomeStatement | BalanceSheetStatement | CashFlowStatement;

export type FinancialStatementItem = IncomeStatementItem | BalanceSheetStatementItem | CashFlowStatementItem;

export interface AnnualStatements {
    fiscalYear: number;
    endDate: string;
    statements: FinancialStatement[];
}

export interface QuarterlyStatements {
    fiscalYear: number;
    periodNumber: number;
    endDate: string;
    statements: FinancialStatement[];
}

export type StatementsByPeriod = AnnualStatements | QuarterlyStatements;

export interface FinancialStatements {
    annual?: AnnualStatements[];
    interim?: QuarterlyStatements[];
    currency?: string;
}

export interface StatementTypeOptionsItem {
    id: StatementTypes;
    translation: string;
}

export const statementTypeOptions: StatementTypeOptionsItem[] = [
    {
        id: StatementTypes.INCOME,
        translation: 'trader.productDetails.tabs.incomeStatement'
    },
    {
        id: StatementTypes.BALANCE,
        translation: 'trader.productDetails.tabs.balanceSheet'
    },
    {
        id: StatementTypes.CASH_FLOW,
        translation: 'trader.productDetails.tabs.cashFlow'
    }
];

export interface UnifiedStatements {
    [StatementPeriodTypes.YEAR]: UnifiedStatementPeriod[];
    [StatementPeriodTypes.QUARTER]: UnifiedStatementPeriod[];
    currency?: string;
}
export interface UnifiedStatementPeriodItem {
    items: StatementItemsDict;
    periodLength?: number;
    source: string;
    periodType?: string;
}
export interface UnifiedStatementPeriod {
    fiscalYear: number;
    periodName: string;
    endDate: Date;
    [StatementTypes.INCOME]: UnifiedStatementPeriodItem;
    [StatementTypes.BALANCE]: UnifiedStatementPeriodItem;
    [StatementTypes.CASH_FLOW]: UnifiedStatementPeriodItem;
}

export type StatementItemsDict = Partial<Record<StatementCode, FinancialStatementItem>>;
