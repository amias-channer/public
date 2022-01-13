import {VwdChartTypes} from '../../models/vwd-api';

// VWD allows to compare products only in "area" chart
export default function canCompareProducts(options: {chartType: VwdChartTypes | undefined}): boolean {
    return options.chartType === VwdChartTypes.AREA;
}
