import {SelectOption} from 'frontend-core/dist/components/ui-trader4/select/index';
import {I18n} from 'frontend-core/dist/models/i18n';
import localize from 'frontend-core/dist/services/i18n/localize';
import {VwdChartTypes} from '../../models/vwd-api';

export default function getChartTypeSelectOptions(i18n: I18n): SelectOption[] {
    return [
        {
            label: localize(i18n, 'trader.productChart.chartTypes.linechart'),
            value: VwdChartTypes.AREA
        },
        {
            label: localize(i18n, 'trader.productChart.chartTypes.candlestick'),
            value: VwdChartTypes.CANDLESTICK
        },
        {
            label: localize(i18n, 'trader.productChart.chartTypes.ohlc'),
            value: VwdChartTypes.OHLC
        }
    ];
}
