export enum OwnershipSubTabs {
    INSIDERS_REPORT = 'REP',
    INSIDER_TRANSACTIONS = 'TRANS',
    TOP_SHAREHOLDERS = 'SHAR'
}

export interface OwnershipSubTabOptionsItem {
    id: OwnershipSubTabs;
    translation: string;
}

export const ownershipSubTabsOptions: [OwnershipSubTabOptionsItem, ...OwnershipSubTabOptionsItem[]] = [
    {
        id: OwnershipSubTabs.TOP_SHAREHOLDERS,
        translation: 'trader.productDetails.tabs.topShareholders'
    },
    {
        id: OwnershipSubTabs.INSIDER_TRANSACTIONS,
        translation: 'trader.productDetails.tabs.insiderTransactions'
    },
    {
        id: OwnershipSubTabs.INSIDERS_REPORT,
        translation: 'trader.productDetails.tabs.insidersReport'
    }
];

export interface Holding {
    name?: string;
    change?: number;
    holdPercentage?: number;
    holdingDate: Date;
    isin: string;
    portfolio?: number;
    sharesHeld?: number;
    turnover?: number;
}

export interface HoldingResponse extends Omit<Holding, 'holdingDate'> {
    holdingDate: string;
}

export interface Investor {
    holdings: Holding[];
    investorId: string;
    name: string;
    type: string;
    holding?: Holding;
}

export interface InvestorResponse extends Omit<Investor, 'lastUpdated' | 'holding' | 'holdings'> {
    holding: HoldingResponse;
    holdings: HoldingResponse[];
    lastUpdated: string;
}

export interface Transaction {
    date?: Date;
    name: string;
    price?: number;
    sharesTraded?: number;
    title?: string;
    type?: string;
}

export interface TransactionResponse extends Omit<Transaction, 'date'> {
    date: string;
}

export interface ShareholdersInfo {
    investors: Investor[];
    totalInvestors: number;
    lastUpdated?: string;
}

export interface InsiderTransactionsInfo extends Pick<ShareholdersInfo, 'lastUpdated'> {
    transactions: Transaction[];
}
export interface TopInvestor {
    id: Investor['investorId'];
    label: string;
    value: number;
    isSelected: boolean;
    color: string;
}

export interface InvestorHolding extends Pick<Investor, 'name' | 'type'>, Omit<Holding, 'name' | 'isin'> {
    id: Investor['investorId'];
}

export type ShareholdersInfoResponse =
    | {investors: InvestorResponse[]; totalInvestors: number; lastUpdated: string}
    | undefined;
export type InsiderTransactionsInfoResponse = {transactions: TransactionResponse[]; lastUpdated: string} | undefined;
