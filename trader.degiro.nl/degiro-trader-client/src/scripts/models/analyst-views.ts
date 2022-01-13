export type PeriodType = 'QTR1' | 'QTR2' | 'QTR3' | 'QTR4' | 'FY';

export enum SectionTypes {
    BAL = 'BAL',
    CASH = 'CASH',
    INC = 'INC',
    VAL = 'VAL'
}

export enum MeasureCodes {
    BPS = 'BPS',
    CPS = 'CPS',
    CPX = 'CPX',
    DPS = 'DPS',
    EBI = 'EBI',
    EBT = 'EBT',
    EPS = 'EPS',
    GPS = 'GPS',
    GRM = 'GRM',
    NAV = 'NAV',
    NDT = 'NDT',
    NET = 'NET',
    PRE = 'PRE',
    ROA = 'ROA',
    ROE = 'ROE',
    SAL = 'SAL'
}
// Every data item in the table should be sorted and visualised by particular order
export const sortedSections: Record<SectionTypes, MeasureCode[]> = {
    [SectionTypes.INC]: [
        MeasureCodes.NET,
        MeasureCodes.GRM,
        MeasureCodes.PRE,
        MeasureCodes.EBT,
        MeasureCodes.DPS,
        MeasureCodes.EPS,
        MeasureCodes.SAL,
        MeasureCodes.GPS,
        MeasureCodes.EBI
    ],
    [SectionTypes.BAL]: [MeasureCodes.BPS, MeasureCodes.NAV, MeasureCodes.NDT],
    [SectionTypes.CASH]: [MeasureCodes.CPX, MeasureCodes.CPS],
    [SectionTypes.VAL]: [MeasureCodes.ROA, MeasureCodes.ROE]
};

export type SectionType = 'Income Statement' | 'Balance Sheet' | 'Cash Flow Statement' | 'Valuation';

export type BalanceSheetMeasureCode = MeasureCodes.BPS | MeasureCodes.NAV | MeasureCodes.NDT;
export type IncomeStatementMeasureCode =
    | MeasureCodes.NET
    | MeasureCodes.GRM
    | MeasureCodes.PRE
    | MeasureCodes.EBT
    | MeasureCodes.DPS
    | MeasureCodes.EPS
    | MeasureCodes.SAL
    | MeasureCodes.GPS
    | MeasureCodes.EBI;
export type ValuationMeasureCode = MeasureCodes.ROA | MeasureCodes.ROE;
export type CashFlowStatementMeasureCode = MeasureCodes.CPX | MeasureCodes.CPS;

export type MeasureCode =
    | BalanceSheetMeasureCode
    | IncomeStatementMeasureCode
    | ValuationMeasureCode
    | CashFlowStatementMeasureCode;

export interface Estimates {
    preferredMeasure: string;
    currency: string;
    lastUpdated?: string;
    annual?: PeriodGroup[];
    interim?: PeriodGroup[];
}

export interface PeriodGroup {
    periodType: PeriodType;
    year: number;
    statements: Statement[];
}

export interface Statement {
    type: string;
    items: StatementItem[];
}

export interface StatementItem {
    name: string;
    code: string;
    value: number;
}

export interface MeasurePeriodItem extends Partial<Pick<StatementItem, 'value'>> {
    measureName?: string;
    year: number;
    periodType: string;
}

export interface MeasureData {
    annual: MeasurePeriodItem[];
    interim: MeasurePeriodItem[];
}

export type MeasuresDict = Record<MeasureCode, MeasureData>;

export interface Section {
    type: SectionType;
    measures: MeasuresDict;
}

export interface UnifiedEstimates
    extends Partial<Pick<Estimates, 'currency' | 'preferredMeasure' | 'annual' | 'interim'>> {
    lastUpdated?: Date;
    sections: Partial<Record<SectionTypes, Section>>;
}

export type MeasureItemDataValue = number | undefined;
export const keyCurrentRatiosIds = [
    'NPRICE',
    'REVGRPCT',
    'PEINCLXOR',
    'APR2REV',
    'AREVPS',
    'AREV',
    'TTMEPSINCX',
    'ADIVSHR'
] as const;

export type KeyCurrentRatios = {
    [key in typeof keyCurrentRatiosIds[number]]?: number;
};

export const keyForecastDataIds = [
    'EPSActualQ',
    'TargetPrice',
    'ProjLTGrowthRate',
    'ProjPE',
    'Price2ProjSales',
    'ProjSalesPS',
    'ProjSales',
    'ProjSalesQ',
    'ProjEPS',
    'ProjEPSQ',
    'ProjDPS'
] as const;

export type KeyForecastData = {
    [key in typeof keyForecastDataIds[number]]?: number;
};

export const keyInterimIncomeStatementDataIds = ['SREV'] as const;

export type KeyInterimIncomeStatementData = {
    [key in typeof keyInterimIncomeStatementDataIds[number]]?: number;
};

export type KeyFigures = KeyCurrentRatios & KeyForecastData & KeyInterimIncomeStatementData;
