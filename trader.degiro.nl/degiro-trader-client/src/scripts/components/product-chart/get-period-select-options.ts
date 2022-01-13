import {SelectOption} from 'frontend-core/dist/components/ui-trader4/select/index';
import {I18n} from 'frontend-core/dist/models/i18n';
import localize from 'frontend-core/dist/services/i18n/localize';
import {VwdChartPeriod, VwdChartPeriodValue} from '../../models/vwd-api';
import getVwdChartPeriods from '../../services/vwd-chart/get-vwd-chart-periods';

const allPeriods: VwdChartPeriod[] = getVwdChartPeriods();
const defaultPeriodsValues: VwdChartPeriodValue[] = [
    'YTD',
    'P1D',
    'P1W',
    'P1M',
    'P3M',
    'P6M',
    'P1Y',
    'P3Y',
    'P5Y',
    'P50Y'
];

export default function getPeriodSelectOptions(i18n: I18n): SelectOption[] {
    return allPeriods
        .filter(({value}) => {
            return value === 'ALL' || defaultPeriodsValues.includes(value);
        })
        .map((period) => {
            const {amount, value} = period;
            const unit: string = localize(i18n, period.translation);

            // VWD doesn't support life-time period, so we use more-less representative big period
            return {
                value: value === 'ALL' ? 'P50Y' : value,
                label: amount ? `${amount} ${unit}` : unit
            };
        });
}
