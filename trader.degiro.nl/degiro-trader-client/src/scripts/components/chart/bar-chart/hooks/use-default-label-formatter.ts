import abbreviateNumber, {NumberAbbrSize} from 'frontend-core/dist/utils/number/abbreviate-number';
import formatNumber from 'frontend-core/dist/utils/number/format-number';
import {useCallback, useContext} from 'react';
import {ConfigContext} from '../../../app-component/app-context';
import {ChartLabelFormatter} from '../bar-chart-y-axis';

const compactViewAbbrSizes: NumberAbbrSize[] = ['T', 'B', 'M', 'K'];
const fullViewAbbrSizes: NumberAbbrSize[] = ['T', 'B', 'M'];

export default function useDefaultLabelFormatter(isCompactView: boolean): ChartLabelFormatter {
    const config = useContext(ConfigContext);

    return useCallback<ChartLabelFormatter>(
        (currentValue: number, _index: number, allValues: number[]) => {
            const maxValue = Math.max(...allValues.map(Math.abs));
            const [, suffix, magnitude] = abbreviateNumber(
                maxValue,
                isCompactView ? compactViewAbbrSizes : fullViewAbbrSizes
            );
            const formattedValue = formatNumber(currentValue / magnitude, {
                fractionDelimiter: config.fractionDelimiter,
                thousandDelimiter: config.thousandDelimiter,
                fractionSize: 1,
                minFractionSize: 1,
                separateThousands: true
            });

            return `${formattedValue}${suffix}`;
        },
        [config, isCompactView]
    );
}
