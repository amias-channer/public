export enum TradingSettingsIds {
    ALLOCATION = 'ALLOCATION',
    CURRENCY = 'CURRENCY',
    DATA_SHARING = 'DATA_SHARING',
    NOTIFICATIONS = 'NOTIFICATIONS',
    PRODUCT_GOVERNANCE_SETTINGS = 'PRODUCT_GOVERNANCE_SETTINGS',
    REAL_TIME_PRICES = 'REAL_TIME_PRICES',
    US_SUBSCRIPTION = 'US_SUBSCRIPTION'
}

export interface TradingSettingsItem {
    id: TradingSettingsIds;
    to: string;
    iconUrl?: string;
    label: string;
    description?: string;
}

export interface TradingSettingsItemsOptions {
    isIexSubscriptionEnabled: boolean;
}
