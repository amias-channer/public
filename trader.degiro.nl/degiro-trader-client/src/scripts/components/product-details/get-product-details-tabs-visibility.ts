/**
 * @description See Trader v3.x getProductDetailsTabsVisibility()
 * @param {ProductInfo} productInfo
 * @param {User} currentClient
 * @returns {ProductDetailsTabsVisibility}
 */
import {ProductInfo} from 'frontend-core/dist/models/product';
import {ProductTypeIds} from 'frontend-core/dist/models/product-type';
import {User} from 'frontend-core/dist/models/user';

export interface ProductDetailsTabsVisibility {
    companyProfile: boolean;
    figures: boolean;
    leveragedProducts: boolean;
    options: boolean;
    ratios: boolean;
    financials: boolean;
    ownership: boolean;
    esgRatings: boolean;
    analystViews: boolean;
}

export default function getProductDetailsTabsVisibility(
    productInfo: ProductInfo,
    currentClient: User
): ProductDetailsTabsVisibility {
    const {productTypeId} = productInfo;
    const isStock: boolean = productTypeId === ProductTypeIds.STOCK;
    const isOption: boolean = productTypeId === ProductTypeIds.OPTION;
    const underlyingIsin: string | undefined = productInfo.isin;
    const hasUnderlyingIsin: boolean = Boolean(underlyingIsin || String(underlyingIsin) === '0');
    const tabsVisibility: ProductDetailsTabsVisibility = {
        companyProfile: true,
        figures: true,
        leveragedProducts: false,
        options: false,
        ratios: false,
        financials: false,
        ownership: false,
        esgRatings: false,
        analystViews: false
    };

    if (isStock) {
        tabsVisibility.leveragedProducts = true;
        tabsVisibility.ratios = true;
        tabsVisibility.financials = true;
        tabsVisibility.ownership = true;
        tabsVisibility.esgRatings = true;
        tabsVisibility.analystViews = true;
    }

    if (!isStock && !isOption && productTypeId !== ProductTypeIds.LEVERAGED) {
        tabsVisibility.companyProfile = false;
        tabsVisibility.figures = false;
    }

    /**
     * Additional conditions:
     * - Visible for productInfo with underlying ISIN
     * - Check restrictions for current client
     */
    tabsVisibility.companyProfile = tabsVisibility.companyProfile && hasUnderlyingIsin;
    tabsVisibility.figures = tabsVisibility.figures && hasUnderlyingIsin;

    // [WF-783] hidden for Options
    if (isOption) {
        tabsVisibility.options = false;
    } else {
        /**
         * Additional conditions:
         * - Visible for productInfo with underlying ISIN
         */
        tabsVisibility.options = Boolean(currentClient.canViewOptions && hasUnderlyingIsin);
    }

    return tabsVisibility;
}
