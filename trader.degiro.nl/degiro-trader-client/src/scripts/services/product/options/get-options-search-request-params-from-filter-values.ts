import {OptionStrikeTypeIds, OptionTypeIds} from 'frontend-core/dist/models/option';
import isFilterOptionAll from 'frontend-core/dist/services/filter/is-filter-option-all';
import {OptionsRequestParams} from 'frontend-core/dist/services/products/option/get-options';
import {OptionsFilters} from './filters-manager';

export default function getOptionsSearchRequestParamsFromFilterValues(filters: OptionsFilters): OptionsRequestParams {
    const {underlying, searchText, country, exchange, month, year, strikeType, optionType} = filters;
    const inputAggregateTypes: string[] = [];
    const inputAggregateValues: string[] = [];
    const params: OptionsRequestParams = {
        inputAggregateTypes,
        inputAggregateValues,
        optionExchangeId: exchange ? Number(exchange) : undefined,
        underlyingIsin: underlying && !isFilterOptionAll(underlying) ? underlying : undefined,
        eurexCountryId: country ? Number(country) : undefined,
        searchText,
        putCall: optionType === OptionTypeIds.CALL ? 'call' : optionType === OptionTypeIds.PUT ? 'put' : undefined
    };

    if (strikeType === OptionStrikeTypeIds.ACTIVE && filters.activeStrikePrice !== undefined) {
        params.activeStrikePrice = filters.activeStrikePrice;
        params.activeStrikeThreshold = filters.activeStrikeThreshold;
    }

    if (month && !isFilterOptionAll(month)) {
        inputAggregateTypes.push('month');
        inputAggregateValues.push(month);
    }

    if (year && !isFilterOptionAll(year)) {
        inputAggregateTypes.push('year');
        inputAggregateValues.push(year);
    }

    return params;
}
