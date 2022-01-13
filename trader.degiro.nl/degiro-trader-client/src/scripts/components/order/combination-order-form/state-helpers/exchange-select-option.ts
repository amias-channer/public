import {SelectOption} from 'frontend-core/dist/components/ui-trader4/select';
import {Exchange} from 'frontend-core/dist/models/exchange';
import {I18n} from 'frontend-core/dist/models/i18n';
import localize from 'frontend-core/dist/services/i18n/localize';

export interface ExchangeSelectOption extends SelectOption {
    value: Exchange;
}

export function getExchangeSelectOption(i18n: I18n, exchange: Exchange): ExchangeSelectOption {
    return {
        value: exchange,
        label: localize(i18n, exchange.name || exchange.translation || '')
    };
}
