import {ScaleLinear} from 'd3-scale';
import * as React from 'react';
import {chartGridLine} from './bar-chart.css';
import translateY from './translate-y';

interface Props {
    scale: ScaleLinear<any, any>;
    left?: number;
    top?: number;
    width?: number;
    ticks: number[];
}

const HorizontalGrid: React.FunctionComponent<Props> = ({scale, left = 0, top = 0, width = 0, ticks}) => (
    <g data-name="horizontalGrid" transform={`translate(${left},${top})`}>
        {ticks.map((tick) => (
            <line key={tick} transform={translateY(scale(tick))} className={chartGridLine} x2={width} />
        ))}
    </g>
);

export default React.memo(HorizontalGrid);
