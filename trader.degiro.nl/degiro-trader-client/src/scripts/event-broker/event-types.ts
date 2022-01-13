export {VwdEvents} from 'vwd-js-sdk/dist/streamer/subscription';

export enum CommonOrderEvents {
    DELETE = 'DELETE_COMMON_ORDER',
    EDIT = 'EDIT_COMMON_ORDER',
    OPEN = 'OPEN_COMMON_ORDER',
    VIEW = 'VIEW_COMMON_ORDER'
}

export enum CashOrderEvents {
    OPEN = 'OPEN_CASH_ORDER'
}

export enum CurrencyOrderEvents {
    OPEN = 'OPEN_CURRENCY_ORDER'
}

export enum CombinationOrderEvents {
    OPEN = 'OPEN_COMBINATION_ORDER'
}

export enum ClientAccountEvents {
    CHANGE_TRADING_PROFILE = 'CHANGE_TRADING_PROFILE',
    LOGOUT = 'LOGOUT',
    SWITCH_ACCOUNT = 'SWITCH_ACCOUNT'
}

export enum AccountSummaryEvents {
    CHANGE_POSITION = 'CHANGE_POSITION',
    CLOSE = 'CLOSE_ACCOUNT_SUMMARY',
    OPEN = 'OPEN_ACCOUNT_SUMMARY',
    SWITCH_OFF_ORDER_VIEW = 'SWITCH_OFF_ORDER_VIEW',
    SWITCH_OFF_VALUES_VISIBILITY = 'SWITCH_OFF_VALUES_VISIBILITY',
    SWITCH_ON_ORDER_VIEW = 'SWITCH_ON_ORDER_VIEW',
    SWITCH_ON_VALUES_VISIBILITY = 'SWITCH_ON_VALUES_VISIBILITY'
}

export enum LanguageSettingsEvents {
    CHANGE_DISPLAY_LANGUAGE = 'CHANGE_DISPLAY_LANGUAGE'
}

export enum ProductTourEvents {
    START = 'START_PRODUCT_TOUR'
}

export enum FeedbackEvents {
    FORCE = 'FORCE_FEEDBACK',
    OPEN = 'OPEN_FEEDBACK'
}

export enum ServiceEvents {
    EXPIRED_SESSION = 'service:expiredSession',
    MAX_FAILED_UPDATE_REQUESTS = 'service:maxFailedUpdateRequests'
}

export enum CurrencyExchangeEvents {
    CHANGE = 'currencyExchange:change',
    CURRENCY_PAIR_PRODUCT = 'currencyExchange:currencyPairProduct',
    LAST_EXCHANGE_RATE = 'currencyExchange:lastExchangeRate'
}

export enum TotalPortfolioEvents {
    CHANGE = 'totalPortfolio:change',
    LAST_DATA = 'totalPortfolio:lastData',
    RESET = 'totalPortfolio:reset'
}

export enum PortfolioEvents {
    ADD = 'portfolio:add',
    CHANGE = 'portfolio:change',
    LAST_ACTIVE_POSITIONS = 'portfolio:lastActivePositions',
    LAST_DATA = 'portfolio:lastData',
    LAST_INACTIVE_POSITIONS = 'portfolio:lastInactivePositions',
    REMOVE = 'portfolio:remove',
    RESET = 'portfolio:reset'
}

export enum AlertsEvents {
    ADD = 'alerts:add',
    CHANGE = 'alerts:change',
    LAST_DATA = 'alerts:lastData',
    MARK_AS_READ = 'alerts:markAsRead',
    REMOVE = 'alerts:remove',
    RESET = 'alerts:reset'
}

export enum OrdersEvents {
    ADD = 'orders:add',
    CHANGE = 'orders:change',
    LAST_DATA = 'orders:lastData',
    REMOVE = 'orders:remove',
    RESET = 'orders:reset'
}

export enum TransactionsEvents {
    ADD = 'transactions:add',
    CHANGE = 'transactions:change',
    LAST_DATA = 'transactions:lastData',
    REMOVE = 'transactions:remove',
    RESET = 'transactions:reset'
}

export enum FavouriteProductsListsEvents {
    UPDATE = 'UPDATE_FAVOURITE_PRODUCTS_LISTS'
}

export enum MarketMoversEvents {
    LOSERS_CHANGE = 'marketMovers:losersChange',
    LOSERS_LAST_DATA = 'marketMovers:losersLastData',
    WINNERS_CHANGE = 'marketMovers:winnersChange',
    WINNERS_LAST_DATA = 'marketMovers:winnersLastData'
}

export enum QuotecastEvents {
    CHANGE = 'quotecast:change'
}

export enum OrderBookEvents {
    CHANGE = 'orderBook:change'
}

export enum ProductNotesEvents {
    UPDATE = 'UPDATE_PRODUCT_NOTES'
}
