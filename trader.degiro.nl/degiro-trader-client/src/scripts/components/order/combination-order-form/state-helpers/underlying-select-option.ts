import {SelectOption} from 'frontend-core/dist/components/ui-trader4/select';
import {OptionUnderlying} from 'frontend-core/dist/models/option';

export interface UnderlyingSelectOption extends SelectOption {
    value: OptionUnderlying;
}

export function getUnderlyingSelectOption(underlying: OptionUnderlying): UnderlyingSelectOption {
    return {
        value: underlying,
        label: `${underlying.symbol} (${underlying.underlyingName})`
    };
}
