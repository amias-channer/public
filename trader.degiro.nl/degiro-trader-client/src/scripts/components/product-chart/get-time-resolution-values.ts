import {VwdChartPeriodValue, VwdChartTypes} from '../../models/vwd-api';
import {VwdChartTimeResolutionValue} from '../../models/product-chart';

export default function getTimeResolutionValues(
    period: VwdChartPeriodValue | undefined,
    chartType: VwdChartTypes | undefined
): VwdChartTimeResolutionValue[] {
    if (period === 'P1D') {
        const values: VwdChartTimeResolutionValue[] = ['PT5M', 'PT15M', 'PT30M', 'PT60M'];

        if (chartType !== VwdChartTypes.CANDLESTICK) {
            values.unshift('PT1M', 'PT2M');
        }

        return values;
    }

    if (period === 'P1W') {
        return ['P1D'];
    }

    if (period === 'P1M') {
        return ['P1D', 'P7D'];
    }

    return ['P1D', 'P7D', 'P1M'];
}
