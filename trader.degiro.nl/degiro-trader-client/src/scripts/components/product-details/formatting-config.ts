import {NumberAbbrSize} from 'frontend-core/dist/utils/number/abbreviate-number';
import {NumberFormattingOptions} from 'frontend-core/dist/utils/number/format-number';
import {defaultDateValueFormat, defaultFullTimeValueFormat} from '../value/hooks/use-date-value';

export const oneColumnLayoutNumberAbbrSizes: NumberAbbrSize[] = ['T', 'B', 'M', 'K'];
export const fullViewLayoutNumberAbbrSizes: NumberAbbrSize[] = ['T', 'B', 'M'];
export const defaultAmountFormatting: NumberFormattingOptions = {roundSize: 2, preset: 'amount'};
export const defaultPercentFormatting: NumberFormattingOptions = {roundSize: 2, preset: 'percent'};
export const defaultDateFormat: string = `${defaultDateValueFormat} ${defaultFullTimeValueFormat}`;
