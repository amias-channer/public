import {ScaleLinear} from 'd3-scale';
import * as React from 'react';
import {chartText} from './bar-chart.css';
import {yTickPadding} from '../constants';
import translateY from './translate-y';

export type ChartLabelFormatter = (currentValue: number, index: number, allValues: number[]) => string;

interface Props {
    scale: ScaleLinear<any, any>;
    left?: number;
    top?: number;
    ticks: number[];
    labelFormatter?: ChartLabelFormatter;
    position?: 'start' | 'end';
    children?: React.ReactNode;
    textClassName?: string;
}

const BarChartYAxis: React.ForwardRefRenderFunction<SVGGElement, Props> = (props, ref) => {
    const {
        scale,
        left = 0,
        top = 0,
        ticks,
        labelFormatter = String,
        position = 'start',
        children,
        textClassName = ''
    } = props;
    const isStartPosition = position === 'start';

    return (
        <g ref={ref} data-name="yAxis" transform={`translate(${left},${top})`}>
            {ticks.map((tick, index) => (
                <g key={tick} transform={translateY(scale(tick))}>
                    <text
                        className={`${chartText} ${textClassName}`}
                        x={isStartPosition ? -yTickPadding : yTickPadding}
                        dy="0.32em"
                        text-anchor={isStartPosition ? 'end' : 'start'}>
                        {labelFormatter(tick, index, ticks)}
                    </text>
                </g>
            ))}
            {children}
        </g>
    );
};

export default React.memo(React.forwardRef(BarChartYAxis));
