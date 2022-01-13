import {ScaleBand, ScalePoint} from 'd3-scale';
import * as React from 'react';
import {chartText} from './bar-chart.css';
import {xTickPadding} from '../constants';

interface Props {
    scale: ScaleBand<any> | ScalePoint<any>;
    left?: number;
    top?: number;
    textClassName?: string;
}

const approximateCharWidth = 7;
const BarChartXAxis: React.ForwardRefRenderFunction<SVGGElement, Props> = (
    {scale, left = 0, top = 0, textClassName = ''},
    ref
) => {
    const ticks = scale.domain();
    const scaleRange = scale.range();
    const scaleWidth = scaleRange[1] - scaleRange[0];
    const totalCharsCount = ticks.reduce((total, tick) => total + tick.length, 0);
    const isCompact = totalCharsCount * approximateCharWidth > scaleWidth;

    return (
        <g data-name="xAxis" transform={`translate(${left},${top})`} ref={ref}>
            {ticks.map((tick) => (
                <g key={tick} transform={`translate(${Number(scale(tick))},0)`}>
                    <text
                        className={`${chartText} ${textClassName}`}
                        y={xTickPadding}
                        dy="0.71em"
                        textAnchor={isCompact ? 'end' : 'middle'}
                        transform={isCompact ? 'rotate(-45)' : undefined}>
                        {tick}
                    </text>
                </g>
            ))}
        </g>
    );
};

export default React.memo(React.forwardRef(BarChartXAxis));
