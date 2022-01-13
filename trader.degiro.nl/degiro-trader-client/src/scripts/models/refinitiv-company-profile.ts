export interface RatioItem {
    id: string;
    name?: string;
    type: string;
    value: string;
}

export interface RatiosGroup {
    name: string;
    items: RatioItem[];
}

export interface Ratios {
    ratiosGroups: RatiosGroup[];
    currency: string;
    priceCurrency?: string;
}

export interface Issue {
    id: number;
    name?: string;
    ticker?: string;
    exchange?: string;
    description?: string;
    mostRecentSplitValue?: string;
    mostRecentSplitDate?: string;
}

export interface CompanyProfileContacts {
    ADDRESS: string;
    CITY: string;
    COUNTRY: string;
    EMAIL: string;
    FAX: string;
    NAME: string;
    POSTCODE: string;
    TELEPHONE: string;
    WEBSITE: string;
    STATEREGION: string;
}

export interface RefinitivCompanyProfileManager {
    name: string;
    function: string;
    longFunction: string;
    age?: number;
    since?: string;
    titleStart?: string;
}

export interface RefinitivCompanyProfile {
    contacts: CompanyProfileContacts;
    sector?: string;
    industry?: string;
    employees?: number;
    businessSummary?: string;
    financialSummary?: string;
    ratios?: Ratios;
    businessSummaryLastModified?: string;
    financialSummaryLastModified?: string;
    forecastData?: ForecastData;
    shrOutstanding?: string;
    shrFloating?: string;
    cmnShareholders?: string;
    laInterimData: string;
    laAnnualData: string;
    luShares: string;
    usIrsNo: string;
    usCikNo: string;
    lastUpdated: string;
    luEmployees: string;
    management?: RefinitivCompanyProfileManager[];
    issues?: Issue[];
}

export interface RefinitivCompanyRatios {
    consRecommendationTrend?: ConsRecommendationTrend;
    forecastData?: ForecastData;
    currentRatios?: Ratios;
    sharesOut?: string;
    totalFloat?: string;
    lastModified?: string;
}

export interface ConsRecommendationTrend {
    opinions: OpinionItem[];
    ratings: PeriodItem[];
    analysts: PeriodItem[];
}

export enum OpinionDescriptions {
    BUY = 'BUY',
    HOLD = 'HOLD',
    NA = 'NA',
    OUTPERFORM = 'OUTPERFORM',
    SELL = 'SELL',
    UNDERPERFORM = 'UNDERPERFORM'
}

export interface OpinionItem {
    opinionCode: number;
    opinionDescription: OpinionDescriptions;
    periods: PeriodItem[];
}

export enum OpinionPeriodTypes {
    '10MA' = '10MA',
    '11MA' = '11MA',
    '1MA' = '1MA',
    '1WA' = '1WA',
    '2MA' = '2MA',
    '3MA' = '3MA',
    '4MA' = '4MA',
    '5MA' = '5MA',
    '6MA' = '6MA',
    '7MA' = '7MA',
    '8MA' = '8MA',
    '9MA' = '9MA',
    CURR = 'CURR'
}

export interface PeriodItem {
    periodType: OpinionPeriodTypes;
    value: number;
}

export interface ForecastData {
    consensusType: string;
    earningsBasis: string;
    endMonth: string;
    fiscalYear: string;
    interimEndCalMonth: string;
    interimEndCalYear: string;
    ratios: RatioItem[];
}

export const keyFiguresIds = [
    'MKTCAP',
    'TTMREV',
    'TTMEBITD',
    'TTMREVPS',
    'PEEXCLXOR',
    'TargetPrice',
    'ProjEPS',
    'TTMDIVSHR'
] as const;

export type KeyFigures = {
    [key in typeof keyFiguresIds[number]]?: string;
};

export const pricingDataIds = [
    'VOL10DAVG',
    'VOL3MAVG',
    'PRYTDPCT',
    'NLOW',
    'NHIG',
    'NPRICE',
    'NHIGDATE',
    'NLOWDATE',
    'PR52WKPCT'
] as const;

export type PricingData = {
    [key in typeof pricingDataIds[number]]?: string;
} & {
    totalFloat?: string;
    sharesOut?: string;
    currency?: string;
    priceCurrency?: string;
};

export const companyRatiosIds = [
    'EV',
    'TTMREVPS',
    'TTMNIAC',
    'TTMGROSMGN',
    'TTMCFSHR',
    'TTMROEPCT',
    'QBVPS',
    'PRICE2BK',
    'QCSHPS',
    'ProjPE',
    'ProjSales',
    'ProjSalesQ',
    'ProjEPSQ',
    'ProjLTGrowthRate',
    'ProjProfit',
    'ProjDPS'
] as const;

export type CompanyRatios = {
    [key in typeof companyRatiosIds[number]]?: string;
};

export const productValuationIds = [
    'APENORM',
    'PEINCLXOR',
    'PEBEXCLXOR',
    'PEEXCLXOR',
    'APEEXCLXOR',
    'TTMPEHIGH',
    'TTMPELOW',
    'TTMPR2REV',
    'APR2REV',
    'TTMPRCFPS',
    'TTMPRFCFPS',
    'APRFCFPS',
    'PRICE2BK',
    'APRICE2BK',
    'PR2TANBK',
    'APR2TANBK',
    'NetDebt_I',
    'NetDebt_A',
    'DivYield_CurTTM',
    'YIELD',
    'YLD5YAVG'
] as const;

export type ProductValuation = {
    [key in typeof productValuationIds[number]]?: string;
};

export const productPerShareIds = [
    'TTMREVPS',
    'AREVPS',
    'TTMDIVSHR',
    'ADIVSHR',
    'QCSHPS',
    'ACSHPS',
    'TTMCFSHR',
    'ACFSHR',
    'TTMFCFSHR',
    'TTMEBITDPS',
    'QBVPS',
    'ABVPS',
    'QTANBVPS',
    'ATANBVPS',
    'TTMEPSINCX',
    'AEPSINCLXO',
    'TTMBEPSXCL',
    'ABEPSXCLXO',
    'TTMEPSXCLX',
    'AEPSXCLXOR',
    'ADIV5YAVG'
] as const;

export type ProductPerShare = {
    [key in typeof productPerShareIds[number]]?: string;
};

export const priceAndVolumeKeys = [
    'NPRICE',
    'PDATE',
    'BETA',
    'VOL10DAVG',
    'VOL3MAVG',
    'NHIG',
    'NHIGDATE',
    'NLOW',
    'NLOWDATE',
    'MKTCAP',
    'PR1DAYPRC',
    'PR5DAYPRC',
    'ChPctPriceMTD',
    'PR13WKPCT',
    'PR26WKPCT',
    'PRYTDPCT',
    'PR52WKPCT',
    'PR04WKPCTR',
    'PR13WKPCTR',
    'PR26WKPCTR',
    'PRYTDPCTR',
    'PR52WKPCTR'
] as const;

export type ProductPriceAndVolume = {
    [key in typeof priceAndVolumeKeys[number]]?: string;
};

export const productGrowthRateIds = [
    'REVCHNGYR',
    'TTMREVCHG',
    'REVGRPCT',
    'REVTRENDGR',
    'REVPS5YGR',
    'EPSCHNGYR',
    'TTMEPSCHG',
    'EPSGRPCT',
    'EPSTRENDGR',
    'DIVGRPCT',
    'BVTRENDGR',
    'TanBV_AYr5CAGR',
    'CSPTRENDGR',
    'Ebitda_AYr5CAGR',
    'Ebitda_TTMY5CAGR',
    'FOCF_AYr5CAGR',
    'NPMTRENDGR',
    'STLD_AYr5CAGR'
] as const;

export type ProductGrowthRate = {
    [key in typeof productGrowthRateIds[number]]?: string;
};

export const productMarginsIds = [
    'AOPMGNPCT',
    'TTMOPMGN',
    'OPMGN5YR',
    'AGROSMGN',
    'TTMGROSMGN',
    'GROSMGN5YR',
    'ANPMGNPCT',
    'TTMNPMGN',
    'MARGIN5YR',
    'APTMGNPCT',
    'TTMPTMGN',
    'PTMGN5YR',
    'Focf2Rev_TTM',
    'Focf2Rev_AAvg5'
] as const;

export type ProductMargins = {
    [key in typeof productMarginsIds[number]]?: string;
};

export const productManagementIds = [
    'TTMROIPCT',
    'AROIPCT',
    'AROI5YRAVG',
    'TTMROAPCT',
    'AROAPCT',
    'AROA5YAVG',
    'TTMROEPCT',
    'AROEPCT',
    'AROE5YAVG',
    'TTMASTTURN',
    'AASTTURN',
    'TTMINVTURN',
    'AINVTURN',
    'TTMRECTURN',
    'ARECTURN',
    'TTMNIPEREM',
    'ANIPEREMP',
    'TTMREVPERE',
    'AREVPEREMP'
] as const;

export type ProductManagement = {
    [key in typeof productManagementIds[number]]?: string;
};

export const productIncomeStatementIds = [
    'TTMREV',
    'AREV',
    'TTMEBITD',
    'AEBITD',
    'TTMEBT',
    'AEBT',
    'AEBTNORM',
    'VDES_TTM',
    'TTMNIAC',
    'ANIAC',
    'ANIACNORM'
] as const;

export type ProductIncomeStatement = {
    [key in typeof productIncomeStatementIds[number]]?: string;
};

export const financialStrengthDataIds = [
    'TTMPAYRAT',
    'APAYRATIO',
    'QCURRATIO',
    'ACURRATIO',
    'QQUICKRATI',
    'AQUICKRATI',
    'TTMFCF',
    'A1FCF',
    'EV2FCF_CurTTM',
    'EV2FCF_CurA',
    'TTMINTCOV',
    'AINTCOV',
    'QLTD2EQ',
    'ALTD2EQ',
    'QTOTD2EQ',
    'ATOTD2EQ'
] as const;

export type ProductFinancialStrength = {
    [key in typeof financialStrengthDataIds[number]]?: string;
};

export const PriceAndVolumeLabels: Partial<Record<keyof ProductPriceAndVolume, string>> = {
    NPRICE: 'Close',
    PDATE: 'Pricing Date',
    BETA: 'Beta',
    VOL10DAVG: '10D Avg Tr Volume',
    VOL3MAVG: '3M Avg Tr Volume',
    NHIG: '12M High',
    NHIGDATE: '12M High Price Date',
    NLOW: '12M Low',
    NLOWDATE: '12M Low Price Date',
    MKTCAP: 'Market Cap'
};

export const companyKeyProjectionsIds = [
    'PEINCLXOR',
    'APR2REV',
    'AREVPS',
    'AREV',
    'SREV',
    'TTMEPSINCX',
    'EPSActualQ',
    'ADIVSHR'
] as const;

export type CompanyKeyProjections = {
    [key in typeof companyKeyProjectionsIds[number]]?: string;
};
