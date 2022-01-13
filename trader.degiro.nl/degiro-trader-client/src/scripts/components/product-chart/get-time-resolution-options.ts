import {SelectOption} from 'frontend-core/dist/components/ui-trader4/select/index';
import {I18n} from 'frontend-core/dist/models/i18n';
import localize from 'frontend-core/dist/services/i18n/localize';
import {VwdChartTimeResolutionValue} from '../../models/product-chart';
import {VwdChartPeriodValue, VwdChartTypes} from '../../models/vwd-api';
import getTimeResolutionValues from './get-time-resolution-values';

interface TimeResolutionLabelParts {
    prefix: string;
    translation: string;
}

const timeResolutionLabelParts: Record<VwdChartTimeResolutionValue, TimeResolutionLabelParts> = {
    PT1S: {prefix: '1', translation: 'trader.productChart.intervalTypes.second'},
    PT15S: {prefix: '15', translation: 'trader.productChart.intervalTypes.seconds'},
    PT30S: {prefix: '30', translation: 'trader.productChart.intervalTypes.seconds'},
    PT1M: {prefix: '1', translation: 'trader.productChart.intervalTypes.minute'},
    PT2M: {prefix: '2', translation: 'trader.productChart.intervalTypes.minutes'},
    PT5M: {prefix: '5', translation: 'trader.productChart.intervalTypes.minutes'},
    PT15M: {prefix: '15', translation: 'trader.productChart.intervalTypes.minutes'},
    PT30M: {prefix: '30', translation: 'trader.productChart.intervalTypes.minutes'},
    PT60M: {prefix: '1', translation: 'trader.productChart.intervalTypes.hour'},
    P1D: {prefix: '1', translation: 'trader.productChart.intervalTypes.day'},
    P7D: {prefix: '1', translation: 'trader.productChart.intervalTypes.week'},
    P1M: {prefix: '1', translation: 'trader.productChart.intervalTypes.month'}
};

export default function getTimeResolutionOptions(
    i18n: I18n,
    period: VwdChartPeriodValue | undefined,
    chartType: VwdChartTypes | undefined
): SelectOption[] {
    return getTimeResolutionValues(period, chartType).map(
        (value: VwdChartTimeResolutionValue): SelectOption => {
            const labelParts: TimeResolutionLabelParts = timeResolutionLabelParts[value];

            return {
                label: `${labelParts.prefix} ${localize(i18n, labelParts.translation)}`,
                value
            };
        }
    );
}
