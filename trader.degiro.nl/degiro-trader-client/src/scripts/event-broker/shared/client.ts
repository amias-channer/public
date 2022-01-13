import {CurrencyPairs} from 'frontend-core/dist/models/currency';
import {EventBrokerStartConfig} from '../../event-broker';

export function getBaseCurrency(eventBrokerConfig: EventBrokerStartConfig): string {
    return eventBrokerConfig.currentClient.accountInfo?.baseCurrency || '';
}

export function getMainClientId(eventBrokerConfig: EventBrokerStartConfig): string {
    return String(eventBrokerConfig.mainClient.id);
}

export function getCurrentClientId(eventBrokerConfig: EventBrokerStartConfig): string {
    return String(eventBrokerConfig.currentClient.id);
}

export function getCurrencyPairs(eventBrokerConfig: EventBrokerStartConfig): CurrencyPairs {
    return eventBrokerConfig.currentClient.accountInfo?.currencyPairs || {};
}
