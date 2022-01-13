import {ProductInfo} from 'frontend-core/dist/models/product';
import {Interval, TimeInterval} from 'frontend-core/dist/models/interval';
import {SortTypes} from 'frontend-core/dist/services/filter';
import {Config} from 'frontend-core/dist/models/config';

export interface AgendaSearchResult<T> {
    offset: number;
    total: number;
    items: T[];
}

export interface AgendaItemResponse {
    eventId: number;
    isin?: string;
    organizationName?: string;
    lastUpdate?: string;
    dateTime: string;
    description: string;
    eventType: AgendaEventTypes;
}

export interface AgendaEconomicItemResponse extends AgendaItemResponse {
    actual?: number;
    classification: string;
    endDateTime: string;
    eventType: AgendaEventTypes.ECONOMIC;
    forecast?: number;
    name: string;
    period: string;
    previous?: number;
    unit: string;
    countryCode?: string;
}

export interface Exchange {
    code: string;
    country: string;
    name: string;
    website?: string;
}

export interface AgendaHolidayItemResponse extends AgendaItemResponse {
    name: string;
    eventType: AgendaEventTypes.HOLIDAY;
    exchanges?: Exchange[];
    country: string;
    countryCode: string;
}

export interface AgendaIpoItemResponse extends AgendaItemResponse {
    exchangeName: string;
    value?: number;
    totalShares?: number;
    price: number;
    priceLow: number;
    priceHigh: number;
    eventType:
        | AgendaEventTypes.IPO_FILINGS
        | AgendaEventTypes.IPO_LOCKUP_EXPIRATIONS
        | AgendaEventTypes.IPO_PRICINGS
        | AgendaEventTypes.IPO_SECONDARY_FILINGS
        | AgendaEventTypes.IPO_SECONDARY_PRICINGS
        | AgendaEventTypes.IPO_SECONDARY_WITHDRAWALS
        | AgendaEventTypes.IPO_WITHDRAWALS;
    countryCode: string;
}

export interface AgendaDividendItemResponse extends AgendaItemResponse {
    exDividendDate?: string;
    paymentDate?: string;
    dividend: number;
    countryCode: string;
    yield?: number;
    eventType: AgendaEventTypes.DIVIDEND;
    currency?: string;
}

export interface AgendaEarningItemDialIn {
    phoneNumber?: string;
    altPhoneNumber?: string;
    password?: string;
    startDate: string;
    endDate: string;
    isAvailable: boolean;
    isEstimated: boolean;
    notes?: string;
}

export interface AgendaEarningItemResponse extends AgendaItemResponse {
    eventType:
        | AgendaEventTypes.EARNING_CALLS_AND_PRESENTATIONS
        | AgendaEventTypes.EARNING_CORPORATE_ANALYST_MEETINGS
        | AgendaEventTypes.EARNING_CORPORATE_CALLS_AND_PRESENTATIONS
        | AgendaEventTypes.EARNING_GUIDANCE_CALLS_AND_PRESENTATIONS
        | AgendaEventTypes.EARNING_MERGER_AND_ACQUISITION_CALLS_AND_PRESENTATIONS
        | AgendaEventTypes.EARNING_OTHER_CORPORATE
        | AgendaEventTypes.EARNING_RELEASES
        | AgendaEventTypes.EARNING_SALES_AND_TRADING_STATEMENT_CALLS_AND_PRESENTATIONS
        | AgendaEventTypes.EARNING_SALES_AND_TRADING_STATEMENT_RELEASES
        | AgendaEventTypes.EARNING_SHAREHOLDER_AND_ANNUAL_MEETINGS;
    countryCode: string;
    liveWebcastUrl?: string;
    replayWebcastUrl?: string;
    type?: string;
    summary?: string;
    notes?: string;
    liveDialIn?: AgendaEarningItemDialIn;
    replayDialIn?: AgendaEarningItemDialIn;
    isEstimated: boolean;
}

export interface AgendaSplitItemResponse extends AgendaItemResponse {
    splitRatio: string;
    eventType: AgendaEventTypes.SPLIT;
    countryCode: string;
}

export type AgendaItem<R extends AgendaItemResponse = AgendaItemResponse> = Omit<R, 'dateTime' | 'lastUpdate'> & {
    typeId: AgendaTypeIds;
    dateTime: Date;
    lastUpdate?: Date;
    productInfo?: ProductInfo;
};

export interface AgendaEconomicItem extends Omit<AgendaItem<AgendaEconomicItemResponse>, 'endDateTime'> {
    endDateTime?: Date;
}

export type AgendaHolidayItem = AgendaItem<AgendaHolidayItemResponse>;

export type AgendaIpoItem = AgendaItem<AgendaIpoItemResponse>;

export interface AgendaDividendItem
    extends Omit<AgendaItem<AgendaDividendItemResponse>, 'exDividendDate' | 'paymentDate'> {
    exDividendDate?: Date;
    paymentDate?: Date;
}

export type AgendaEarningItem = AgendaItem<AgendaEarningItemResponse>;

export interface AgendaSplitItem extends Omit<AgendaItem<AgendaSplitItemResponse>, 'paymentDate'> {
    paymentDate?: Date;
}

export enum DurationTypes {
    ACTUAL = 'ACTUAL',
    ALL = 'ALL',
    ESTIMATED = 'ESTIMATED'
}

export enum AgendaTypeIds {
    DIVIDEND = 'DividendCalendar',
    EARNING = 'EarningsCalendar',
    ECONOMIC = 'EconomicCalendar',
    HOLIDAY = 'HolidayCalendar',
    IPO = 'IpoCalendar',
    SPLIT = 'SplitCalendar'
}

export enum AgendaEventTypes {
    DIVIDEND = 'ExDividends',
    EARNING_CALLS_AND_PRESENTATIONS = 'EarningsCallsAndPresentations',
    EARNING_CORPORATE_ANALYST_MEETINGS = 'CorporateAnalystMeetings',
    EARNING_CORPORATE_CALLS_AND_PRESENTATIONS = 'CorporateCallsAndPresentations',
    EARNING_GUIDANCE_CALLS_AND_PRESENTATIONS = 'GuidanceCallsAndPresentations',
    EARNING_MERGER_AND_ACQUISITION_CALLS_AND_PRESENTATIONS = 'MergerAndAcquisitionCallsAndPresentations',
    EARNING_OTHER_CORPORATE = 'OtherCorporate',
    EARNING_RELEASES = 'EarningsReleases',
    EARNING_SALES_AND_TRADING_STATEMENT_CALLS_AND_PRESENTATIONS = 'SalesAndTradingStatementCallsAndPresentations',
    EARNING_SALES_AND_TRADING_STATEMENT_RELEASES = 'SalesAndTradingStatementReleases',
    EARNING_SHAREHOLDER_AND_ANNUAL_MEETINGS = 'ShareholderAndAnnualMeetings',
    ECONOMIC = 'EconomicEvents',
    HOLIDAY = 'MarketHolidays',
    IPO_FILINGS = 'IpoFilings',
    IPO_LOCKUP_EXPIRATIONS = 'IpoLockupExpirations',
    IPO_PRICINGS = 'IpoPricings',
    IPO_SECONDARY_FILINGS = 'SecondaryFilings',
    IPO_SECONDARY_PRICINGS = 'SecondaryPricings',
    IPO_SECONDARY_WITHDRAWALS = 'SecondaryWithdrawals',
    IPO_WITHDRAWALS = 'IpoWithdrawals',
    SPLIT = 'StockSplits'
}

export enum AgendaPeriodTypes {
    CUSTOM = 'Custom',
    LAST_SEVEN_DAYS = 'LastSevenDays',
    LAST_SEVEN_DAYS_INCLUDING_TODAY = 'LastSevenDaysIncludingToday',
    LAST_SIX_MONTHS = 'LastSixMonths',
    LAST_SIX_MONTHS_INCLUDING_TODAY = 'LastSixMonthsIncludingToday',
    NEXT_SEVEN_DAYS = 'NextSevenDays',
    NEXT_SEVEN_DAYS_INCLUDING_TODAY = 'NextSevenDaysIncludingToday',
    NEXT_SIX_MONTHS = 'NextSixMonths',
    NEXT_SIX_MONTHS_INCLUDING_TODAY = 'NextSixMonthsIncludingToday',
    NEXT_TWO_WEEKS = 'NextTwoWeeks',
    NEXT_WEEK = 'NextWeek',
    THIS_WEEK = 'ThisWeek',
    TODAY = 'Today',
    TOMORROW = 'Tomorrow',
    YESTERDAY = 'Yesterday'
}

export type AgendaSortColumn =
    | AgendaEarningSortColumns
    | AgendaEconomicSortColumns
    | AgendaHolidaySortColumns
    | AgendaSplitSortColumns
    | AgendaIPOSortColumns;

export enum AgendaDividendsSortColumns {
    COMPANY = 'company',
    CURRENCY = 'currency',
    DIVIDEND = 'dividend',
    EX_DIVIDEND_DATE = 'date',
    PAYMENT_DATE = 'paymentDate',
    YIELD = 'yield'
}

export enum AgendaEarningSortColumns {
    CAST = 'cast',
    COMPANY = 'company',
    DATE = 'date',
    ESTIMATED = 'estimated',
    EVENT = 'event',
    TYPE = 'type'
}

export enum AgendaEconomicSortColumns {
    CLASSIFICATION = 'classification',
    COUNTRY = 'country',
    END_DATE = 'endDate',
    EVENT = 'event',
    START_DATE = 'date',
    UNIT = 'unit'
}

export enum AgendaHolidaySortColumns {
    COUNTRY = 'country',
    DATE = 'date',
    EXCHANGE = 'exchange',
    HOLIDAY = 'holiday'
}

export enum AgendaSplitSortColumns {
    EX_DATE = 'date',
    PRODUCT_EVENT = 'productevent'
}

export enum AgendaIPOSortColumns {
    COMPANY = 'company',
    EVENT_DATE = 'date',
    EVENT_TYPE = 'eventType',
    EXCHANGE = 'exchange',
    PRICE = 'price'
}

export interface AgendaRequestParams {
    isin?: string;
    startDate: Date;
    endDate: Date;
    offset: number;
    limit: number;
    calendarType: AgendaTypeIds;
    companyName?: string;
    orderByDesc?: boolean;
    units?: [string, ...string[]];
    classifications?: [string, ...string[]];
    countries?: [string, ...string[]];
    sortColumn?: AgendaSortColumn;
    sortType?: SortTypes;
}

export interface AgendaDividendRequestParams extends AgendaRequestParams {
    currencies?: [string, ...string[]];
    fromDividend?: number;
    toDividend?: number;
    fromYield?: number;
    toYield?: number;
}

export interface AgendaEarningsRequestParams extends AgendaRequestParams {
    eventTypes?: [string, ...string[]];
    isEstimated?: boolean;
}

export interface AgendaIpoRequestParams extends AgendaRequestParams {
    exchanges?: [string, ...string[]];
    eventTypes?: [string, ...string[]];
    fromPrice?: number;
    toPrice?: number;
}

export interface AgendaType {
    id: AgendaTypeIds;
    translation: string;
}

export const agendaTypes: AgendaType[] = [
    {
        id: AgendaTypeIds.ECONOMIC,
        translation: 'trader.markets.agenda.types.economicCalendar'
    },
    {
        id: AgendaTypeIds.HOLIDAY,
        translation: 'trader.markets.agenda.types.holidaysCalendar'
    },
    {
        id: AgendaTypeIds.IPO,
        translation: 'trader.markets.agenda.types.ipoSpoCalendar'
    },
    {
        id: AgendaTypeIds.DIVIDEND,
        translation: 'trader.markets.agenda.types.dividendsCalendar'
    },
    {
        id: AgendaTypeIds.EARNING,
        translation: 'trader.markets.agenda.types.earningsCalendar'
    },
    {
        id: AgendaTypeIds.SPLIT,
        translation: 'trader.markets.agenda.types.splitsCalendar'
    }
];

export type AgendaAnyTypeItem =
    | AgendaEarningItem
    | AgendaDividendItem
    | AgendaIpoItem
    | AgendaSplitItem
    | AgendaHolidayItem
    | AgendaEconomicItem;

export interface Classifications {
    [key: string]: string;
}

export interface AgendaCommonFiltersOptions {
    countries: string[];
    periodBoundaries: TimeInterval;
}

export interface AgendaEconomicFiltersOptions extends AgendaCommonFiltersOptions {
    units: string[];
    currencies: string[];
    classifications: Classifications;
}

export interface AgendaDividendsFiltersOptions extends AgendaCommonFiltersOptions {
    currencies: string[];
    dividendInterval: Interval;
    yieldInterval: Interval;
}

export interface AgendaIpoFiltersOptions extends AgendaCommonFiltersOptions {
    priceInterval: Interval<number>;
    exchanges: string[];
    eventTypes: string[];
}

export interface AgendaEarningsFiltersOptions extends AgendaCommonFiltersOptions {
    eventTypes: string[];
    duration?: DurationTypes;
}
interface FiltersOptionsResponsePeriodBoundaries {
    minDate?: string;
    maxDate?: string;
}

export type AgendaCommonFiltersOptionsResponse = Omit<AgendaCommonFiltersOptions, 'periodBoundaries'> &
    FiltersOptionsResponsePeriodBoundaries;

export type AgendaEconomicFiltersOptionsResponse = Omit<AgendaEconomicFiltersOptions, 'periodBoundaries'> &
    FiltersOptionsResponsePeriodBoundaries;

export interface AgendaEarningsFiltersOptionsResponse
    extends Omit<AgendaCommonFiltersOptions, 'periodBoundaries'>,
        FiltersOptionsResponsePeriodBoundaries {
    eventTypes: string[];
}

export interface AgendaDividendsFiltersOptionsResponse
    extends Required<
        Omit<AgendaDividendsFiltersOptions, 'periodBoundaries' | 'dividendInterval' | 'yieldInterval'> &
            FiltersOptionsResponsePeriodBoundaries
    > {
    currencies: string[];
    fromDividend: number;
    toDividend: number;
    fromYield: number;
    toYield: number;
}

export interface AgendaIpoFiltersOptionsResponse
    extends Omit<AgendaCommonFiltersOptions, 'periodBoundaries'>,
        FiltersOptionsResponsePeriodBoundaries {
    exchanges: string[];
    eventTypes: string[];
    fromPrice: number;
    toPrice: number;
}

export interface AgendaFiltersData {
    fromDate?: Date;
    toDate?: Date;
    searchText: string;
    agendaPeriodType: AgendaPeriodTypes;
}
export interface AgendaCommonFiltersData extends Partial<AgendaCommonFiltersOptions>, AgendaFiltersData {}
export interface AgendaDividendsFiltersData
    extends AgendaFiltersData,
        Partial<Omit<AgendaDividendsFiltersOptions, 'yieldInterval' | 'dividendInterval'>> {
    yieldInterval?: Interval;
    dividendInterval?: Interval;
}
export interface AgendaEconomicFiltersData
    extends Partial<Omit<AgendaEconomicFiltersOptions, 'classifications'>>,
        AgendaFiltersData {
    classifications?: string[];
}
export type AgendaEarningsFiltersData = AgendaFiltersData & Partial<AgendaEarningsFiltersOptions>;
export type AgendaIpoFiltersData = AgendaFiltersData & Partial<AgendaIpoFiltersOptions>;

export const defaultIntervalBoundaries: Interval<number> = {start: 0, end: 0};
export const defaultIntervalValue: Interval<number> = {
    start: -Infinity,
    end: Infinity
};

export type AgendaAnyFiltersOptions =
    | AgendaCommonFiltersOptions
    | AgendaEarningsFiltersOptions
    | AgendaEconomicFiltersOptions
    | AgendaIpoFiltersOptions
    | AgendaDividendsFiltersOptions;

export type AgendaAnyRequestParams = AgendaRequestParams &
    AgendaIpoRequestParams &
    AgendaDividendRequestParams &
    AgendaEarningsRequestParams;

export type AgendaAnyFiltersData =
    | AgendaEconomicFiltersData
    | AgendaCommonFiltersData
    | AgendaIpoFiltersData
    | AgendaDividendsFiltersData
    | AgendaEarningsFiltersData;
export type AgendaRequest = (
    config: Config,
    params: AgendaAnyRequestParams
) => Promise<AgendaSearchResult<AgendaAnyTypeItem>>;
export type RequestParams = Partial<AgendaAnyRequestParams>;
