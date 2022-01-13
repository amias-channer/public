import {ProductInfo} from 'frontend-core/dist/models/product';

export const newsListId: string = 'list';

export const storageKey: string = 'news';
export const filtersStorageKey = 'newsFilters';
export type NewsSubCategoryId = string;

export interface MarketsNewsParams {
    subCategoryId?: string;
    id?: string;
}

export interface NewsSettings {
    enabledLanguageCodes: string[];
    defaultLanguageCode: string;
}

export interface NewsResponse {
    offset: number;
    total: number;
    items: NewsArticle[];
}

export interface NewsArticleResponse {
    id: string;
    title: string;
    date: string;
    lastUpdated?: string;
    category?: string;
    brief?: string;
    pictureUrl?: string;
    source?: string;
    content: string;
    htmlContent: boolean;
    isins?: string[];
}

export interface NewsArticle {
    id: string;
    title: string;
    date: Date;
    lastUpdated?: Date;
    category?: string;
    subCategoryLabel?: string;
    brief?: string;
    pictureUrl?: string;
    source?: string;
    content: string;
    hasHtmlContent: boolean;
    products: ProductInfo[];
    isins?: string[];
}

export enum NewsCategoryIds {
    ALL = 'all',
    BANKING_AND_FINANCE = 'bankingAndFinance',
    COMPANIES = 'companies',
    INDUSTRIES = 'industries',
    MARKETS = 'markets',
    NATIONAL_AND_REGIONAL = 'nationalAndRegional',
    ON_FOCUS = 'onFocus'
}

export interface NewsCategory {
    id: NewsCategoryIds;
    label: string;
    subCategories: NewsSubCategory[];
}

export interface NewsSubCategory {
    id: NewsSubCategoryId;
    label: string;
}

export enum NewsTypes {
    LATEST_NEWS = 'latest-news',
    MOST_IMPORTANT_SIGNIFICANT_DEVELOPMENTS = 'most-important-significant-developments',
    NEWS_BY_COMPANY = 'news-by-company',
    SIGNIFICANT_DEVELOPMENTS = 'significant-developments',
    TOP_NEWS = 'top-news'
}

export interface NewsLanguage {
    code: string;
    countryCode: string;
    label: string;
    enabled?: boolean;
}

export const availableNewsLanguages: ReadonlyArray<NewsLanguage> = [
    {code: 'en', countryCode: 'gb', label: 'English'},
    {code: 'nl', countryCode: 'nl', label: 'Nederlands'},
    {code: 'de', countryCode: 'de', label: 'Deutsch'},
    {code: 'es', countryCode: 'es', label: 'Español'},
    {code: 'fr', countryCode: 'fr', label: 'Français'},
    {code: 'pt', countryCode: 'pt', label: 'Português'},
    {code: 'it', countryCode: 'it', label: 'Italiano'},
    {code: 'el', countryCode: 'gr', label: 'Ελληνικά'},
    {code: 'sv', countryCode: 'se', label: 'Svenska'},
    {code: 'da', countryCode: 'dk', label: 'Dansk'},
    {code: 'pl', countryCode: 'pl', label: 'Polski'},
    {code: 'cs', countryCode: 'cz', label: 'Čeština'}
];
