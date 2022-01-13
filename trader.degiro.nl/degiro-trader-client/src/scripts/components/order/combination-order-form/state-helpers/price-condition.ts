import {SelectOption} from 'frontend-core/dist/components/ui-trader4/select';
import {PriceConditionIds} from 'frontend-core/dist/models/combination-order';
import {I18n} from 'frontend-core/dist/models/i18n';
import localize from 'frontend-core/dist/services/i18n/localize';

export interface PriceConditionOption extends SelectOption {
    value: PriceConditionIds;
}

export function getPriceConditionSelectOption(i18n: I18n, priceCondition: PriceConditionIds): PriceConditionOption {
    return {
        value: priceCondition,
        label:
            priceCondition === PriceConditionIds.PAY
                ? localize(i18n, 'trader.combinationOrder.payAction')
                : localize(i18n, 'trader.combinationOrder.receiveAction')
    };
}
