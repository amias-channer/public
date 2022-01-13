import {VwdChartPeriod, VwdChartPeriodValue} from '../../models/vwd-api';

export interface VwdChartPeriodsParams {
    defaultPeriod?: VwdChartPeriodValue;
    exclude?: VwdChartPeriodValue[];
}

export default function getVwdChartPeriods(params?: VwdChartPeriodsParams): VwdChartPeriod[] {
    const {defaultPeriod = 'P1D', exclude = []} = params || {};
    const allPeriods: VwdChartPeriod[] = [
        {
            translation: 'koers.detail.graph.ytd',
            value: 'YTD'
        },
        {
            translation: 'koers.detail.graph.day',
            amount: 1,
            value: 'P1D'
        },
        {
            translation: 'koers.detail.graph.week',
            amount: 1,
            value: 'P1W'
        },
        {
            translation: 'koers.detail.graph.month',
            amount: 1,
            value: 'P1M'
        },
        {
            translation: 'koers.detail.graph.month',
            amount: 3,
            value: 'P3M'
        },
        {
            translation: 'koers.detail.graph.month',
            amount: 6,
            value: 'P6M'
        },
        {
            translation: 'koers.detail.graph.year',
            amount: 1,
            value: 'P1Y'
        },
        {
            translation: 'koers.detail.graph.year',
            amount: 3,
            value: 'P3Y'
        },
        {
            translation: 'koers.detail.graph.year',
            amount: 5,
            value: 'P5Y'
        },
        {
            translation: 'koers.detail.graph.all',
            value: 'ALL'
        }
    ];
    const result: VwdChartPeriod[] = allPeriods.filter((period: VwdChartPeriod) => {
        return exclude.indexOf(period.value) < 0;
    });

    result.some((period: VwdChartPeriod) => {
        if (period.value === defaultPeriod) {
            period.default = true;
            return true;
        }

        return false;
    });

    return result;
}
