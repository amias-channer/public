import * as React from 'react';
import {Point} from '../../../models/chart';
import {downtrend, lineChart, uptrend} from './line-chart.css';

export interface LineChartProps {
    className?: string;
    height: number;
    points: Point[];
    width: number;
    hasCircles?: boolean;
    circleClassName?: string;
    circleRadius?: string;
}

const {useMemo} = React;
const LineChart: React.FunctionComponent<LineChartProps> = ({
    circleClassName,
    circleRadius = 3,
    hasCircles,
    className = '',
    height,
    points,
    width
}) => {
    const polylinePoints: string = useMemo(() => points.map(({x, y}: Point) => `${x},${y}`).join(' '), points);
    const deltaY: number = points[0]?.y - points[points.length - 1]?.y;
    const polylineClassName: string = `${lineChart} ${className} ${deltaY > 0 ? uptrend : ''} ${
        deltaY < 0 ? downtrend : ''
    }`;

    return (
        <svg width={width} height={height}>
            {points.length > 1 && <polyline className={polylineClassName} points={polylinePoints} />}
            {hasCircles &&
                points.map(({x, y}: Point) => (
                    <circle key={`${x}-${y}`} className={circleClassName} cx={x} cy={y} r={circleRadius} />
                ))}
        </svg>
    );
};

export default React.memo(LineChart);
