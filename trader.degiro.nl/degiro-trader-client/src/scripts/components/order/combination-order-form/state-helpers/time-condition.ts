import {SelectOption} from 'frontend-core/dist/components/ui-trader4/select';
import {I18n} from 'frontend-core/dist/models/i18n';
import {OrderTimeTypeNames} from 'frontend-core/dist/models/order';
import localize from 'frontend-core/dist/services/i18n/localize';

export interface TimeConditionOption extends SelectOption {
    value: OrderTimeTypeNames;
}

export function getTimeConditionSelectOption(i18n: I18n, timeCondition: OrderTimeTypeNames): TimeConditionOption {
    return {
        value: timeCondition,
        label:
            timeCondition === OrderTimeTypeNames.DAY
                ? localize(i18n, 'order.timeType.date')
                : localize(i18n, 'order.timeType.gtc')
    };
}
