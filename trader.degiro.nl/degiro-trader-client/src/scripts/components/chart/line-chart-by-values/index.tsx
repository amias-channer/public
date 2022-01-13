import * as React from 'react';
import omitNullable from 'frontend-core/dist/utils/omit-nullable';
import LineChart from '../line-chart';
import {Point} from '../../../models/chart';
import {baseLine} from './line-chart-by-values.css';

type OptionalValue = number | undefined;
export interface LineChartByValuesProps {
    className?: string;
    height: number;
    baseLineClassName?: string;
    values: [OptionalValue, ...OptionalValue[]];
    verticalPadding?: number;
    width: number;
}

const {useMemo} = React;
const LineChartByValues: React.FunctionComponent<LineChartByValuesProps> = ({
    className,
    height,
    baseLineClassName = '',
    values,
    verticalPadding = 1,
    width
}) => {
    const contentHeight: number = height - 2 * verticalPadding;
    const nonEmptyValues: number[] = omitNullable(values);
    const minValue: number = Math.min(...nonEmptyValues);
    const maxValue: number = Math.max(...nonEmptyValues);
    const range: number = maxValue - minValue;
    const stepX: number = width / (values.length - 1);
    const stepY: number = range ? contentHeight / range : 0;
    const points: Point[] = useMemo(() => {
        return values.reduce((points: Point[], value: OptionalValue, index: number) => {
            if (value !== undefined) {
                return [...points, {x: stepX * index, y: stepY * (maxValue - value) + verticalPadding}];
            }

            return points;
        }, []);
    }, [maxValue, stepX, stepY, values, verticalPadding]);
    const firstValue: OptionalValue = values[0];
    const pointY: number | undefined =
        firstValue === undefined ? undefined : stepY * (maxValue - firstValue) + verticalPadding;

    return (
        <svg width={width} height={height}>
            {pointY !== undefined && (
                <line className={`${baseLine} ${baseLineClassName}`} x1={0} y1={pointY} x2={width} y2={pointY} />
            )}
            <LineChart className={className} height={height} points={points} width={width} />
        </svg>
    );
};

export default React.memo(LineChartByValues);
