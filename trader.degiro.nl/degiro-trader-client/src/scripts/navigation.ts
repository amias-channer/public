export {Routes} from 'frontend-core/dist/components/ui-trader4/navigation';

/**
 * @description If URL contains this query param Order form should be opened
 * @type {string}
 */
export const newCommonOrderParam: string = 'newOrder';

/**
 * @description If URL contains this query param the app should switch to the "order mode"
 * @type {string}
 */
export const orderModeParam: string = 'orderMode';

/**
 * @description If URL contains this query Cash Order form should be opened
 * @type {string}
 */
export const cashOrderResultParam: string = 'cashOrderResult';

export enum ProductSubLinks {
    ANALYST_VIEWS = 'analyst',
    COMPANY_PROFILE = 'company',
    DOCUMENTS = 'documents',
    ESG_RATINGS = 'esg-ratings',
    FIGURES = 'figures',
    FINANCIALS = 'financials',
    LEVERAGED_PRODUCTS = 'leveraged',
    NEWS = 'news',
    OPTIONS = 'options',
    OVERVIEW = 'overview',
    OWNERSHIP = 'ownership',
    RATIOS = 'ratios'
}
