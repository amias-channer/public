import {ProductTourSteps} from '../state-helpers/steps';

export const querySelectorsForCompactMode: Record<ProductTourSteps, string> = {
    [ProductTourSteps.CASH_ORDER]: '[data-name="cashOrderButton"]',
    [ProductTourSteps.PRODUCTS_SEARCH]: '[data-name="quickSearchMenuItem"]',
    [ProductTourSteps.QUICK_ORDER]: '[data-name="quickOrderButton"]',
    [ProductTourSteps.ACTIVITY]: '[data-name="accountActivityMenuItem"]',
    [ProductTourSteps.ACCOUNT_SUMMARY]: '[data-name="compactHeader"]'
};
export const querySelectorsForFullMode: Record<ProductTourSteps, string> = {
    [ProductTourSteps.CASH_ORDER]: '[data-name="cashOrderMenuButton"]',
    [ProductTourSteps.PRODUCTS_SEARCH]: '[data-name="quickSearch"] [data-name="inputLayout"]',
    [ProductTourSteps.QUICK_ORDER]: '[data-name="placeOrderMenuButton"]',
    [ProductTourSteps.ACTIVITY]: '[data-name="accountActivityMenuItem"]',
    [ProductTourSteps.ACCOUNT_SUMMARY]: '[data-name="accountSummary"]'
};
