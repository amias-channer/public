import * as React from 'react';
import {Point} from '../../../models/chart';
import LineChart from '../line-chart';
import {circle, circleDowntrend, circleUptrend, dashedLine} from './trend-line.css';

export interface TrendLineProps {
    endCircleRadius?: number;
    endPoint: Point;
    height: number;
    lineClassName?: string;
    startCircleRadius?: number;
    startPoint: Point;
    width: number;
}

const TrendLine: React.FunctionComponent<TrendLineProps> = ({
    endCircleRadius = 0,
    endPoint,
    height,
    lineClassName = '',
    startCircleRadius = 0,
    startPoint,
    width
}) => {
    const deltaY: number = startPoint.y - endPoint.y;
    const circleClassName: string = `${circle} ${deltaY > 0 ? circleUptrend : ''} ${deltaY < 0 ? circleDowntrend : ''}`;

    return (
        <svg data-name="trendLine" height={height} width={width}>
            <LineChart
                className={`${dashedLine} ${lineClassName}`}
                height={height}
                points={[startPoint, endPoint]}
                width={width}
            />
            {startCircleRadius > 0 && (
                <circle className={circleClassName} cx={startPoint.x} cy={startPoint.y} r={startCircleRadius} />
            )}
            {endCircleRadius > 0 && (
                <circle className={circleClassName} cx={endPoint.x} cy={endPoint.y} r={endCircleRadius} />
            )}
        </svg>
    );
};

export default React.memo(TrendLine);
