import * as React from 'react';
import {NumberFormattingOptions} from 'frontend-core/dist/utils/number/format-number';
import {scaleLinear, ScaleLinear} from 'd3-scale';
import TrendLine from '../../../chart/trend-line';
import getExtremes from '../../../chart/two-points-chart/get-extremes-absolute-range';
import getFractionSize from '../../../chart/two-points-chart/get-fraction-size';
import NumberAbbr from '../../../value/number-abbr';
import NumericValue from '../../../value/numeric';
import {oneColumnLayoutNumberAbbrSizes} from '../../formatting-config';
import {Point} from '../../../../models/chart';
import {negativeValue, positiveValue} from '../../../value/value.css';
import {row, cell} from './key-projections.css';

interface Props {
    isCompactView: boolean;
    label?: React.ReactNode;
    last?: number;
    projected?: number;
}

const {useMemo} = React;
const KeyProjectionsItemRow: React.FunctionComponent<Props> = ({isCompactView, label = '', last, projected}) => {
    const width: number = isCompactView ? 32 : 68;
    const height: number = 24;
    const circleRadius: number = 2;
    const shouldUseNumberAbbreviations: boolean =
        Math.min(
            last === undefined ? Infinity : Math.abs(last),
            projected === undefined ? Infinity : Math.abs(projected)
        ) > 1000;
    const fractionSize: number = getFractionSize([last, projected]);
    const formattingOptions: NumberFormattingOptions = useMemo(
        () => ({
            fractionSize,
            minFractionSize: fractionSize,
            roundSize: fractionSize
        }),
        [fractionSize]
    );
    const points: {start: Point; end: Point} | undefined = useMemo(() => {
        if (last === undefined || projected === undefined) {
            return undefined;
        }

        const {min, max} = getExtremes({width, height, firstValue: last, secondValue: projected});
        const yScale: ScaleLinear<number, number> = scaleLinear()
            .domain([min, max])
            .range([height - 2 * circleRadius, 0]);

        return {
            start: {
                x: circleRadius,
                y: (yScale(last) || 0) + circleRadius
            },
            end: {
                x: width - circleRadius,
                y: (yScale(projected) || 0) + circleRadius
            }
        };
    }, [circleRadius, height, last, projected, width]);
    const projectedClassName: string =
        last !== undefined && projected !== undefined
            ? `${projected > last ? positiveValue : ''} ${projected < last ? negativeValue : ''}`
            : '';

    return (
        <tr className={row}>
            <td className={cell}>{label}</td>
            <td className={cell}>
                {shouldUseNumberAbbreviations ? (
                    <NumberAbbr
                        id="keyProjectionsItem"
                        field="last"
                        value={last}
                        sizes={oneColumnLayoutNumberAbbrSizes}
                    />
                ) : (
                    <NumericValue id="keyProjectionsItem" field="last" value={last} formatting={formattingOptions} />
                )}
            </td>
            <td className={cell}>
                {shouldUseNumberAbbreviations ? (
                    <NumberAbbr
                        className={projectedClassName}
                        id="keyProjectionsItem"
                        field="projected"
                        value={projected}
                        sizes={oneColumnLayoutNumberAbbrSizes}
                    />
                ) : (
                    <NumericValue
                        className={projectedClassName}
                        id="keyProjectionsItem"
                        field="projected"
                        value={projected}
                        formatting={formattingOptions}
                    />
                )}
            </td>
            <td className={cell}>
                {points && (
                    <TrendLine
                        endCircleRadius={circleRadius}
                        startCircleRadius={circleRadius}
                        width={width}
                        height={height}
                        endPoint={points.end}
                        startPoint={points.start}
                    />
                )}
            </td>
        </tr>
    );
};

export default React.memo(KeyProjectionsItemRow);
