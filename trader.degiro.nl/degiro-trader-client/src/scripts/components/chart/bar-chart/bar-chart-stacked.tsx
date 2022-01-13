import {scaleLinear, scalePoint} from 'd3-scale';
import useElementSize, {ElementSize} from 'frontend-core/dist/hooks/use-element-size';
import * as React from 'react';
import {BarChartPoint, PlotOffset} from '../../../models/chart';
import BarChartXAxis from './bar-chart-x-axis';
import BarChartYAxis, {ChartLabelFormatter} from './bar-chart-y-axis';
import {chartContainer, chartText} from './bar-chart.css';
import {grid} from '../constants';
import getBarWidth from './get-bar-width';
import getSingleAxisTicks from './get-single-axis-ticks';
import HorizontalGrid from './horizontal-grid';
import NoData from './no-data';

const {useRef} = React;

interface Props {
    chartData: BarChartPoint[];
    labelFormatter?: ChartLabelFormatter;
    colors: string[];
    height: number;
}

function stackValues(values: (number | undefined)[]): [number, number][] {
    return values.reduce((stackedValues: [number, number][], value: number = 0, index) => {
        const start: number = index ? stackedValues[index - 1][1] : 0;

        return [...stackedValues, [start, start + value]];
    }, []);
}
const getMaxYValue = (chartData: BarChartPoint[]): number =>
    chartData.reduce(
        (maxValue, dataPoint) =>
            Math.max(
                maxValue,
                dataPoint.groupValues.reduce<number>((sum, x) => sum + (x || 0), 0)
            ),
        0
    );
const plotOffset: PlotOffset = {bottom: 5 * grid, top: 5 * grid, left: 2 * grid, right: 0};
const BarChartStacked: React.FunctionComponent<Props> = ({chartData, labelFormatter, colors, height}) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartContainerSize: ElementSize | undefined = useElementSize(chartContainerRef);
    const chartWidth = chartContainerSize?.width || 0;
    const yAxisRef = useRef<SVGGElement>(null);
    const yAxisSize: ElementSize | undefined = useElementSize(yAxisRef);
    const yAxisWidth = yAxisSize?.width || 0;
    // plot dimensions
    const plotTop = plotOffset.top;
    const plotRight = chartWidth - plotOffset.right;
    const plotBottom = height - plotOffset.bottom;
    const plotLeft = plotOffset.left + yAxisWidth;
    const plotWidth = plotRight - plotLeft;
    // groups
    const groupNames = chartData.map((point) => point.groupName);
    const groupElementsCount = chartData[0]?.groupValues.length || 0;
    const barWidth = getBarWidth(plotWidth, chartData.length);
    const hasNoData = groupElementsCount === 0;
    const maxYValue: number = hasNoData ? 0 : getMaxYValue(chartData);
    const yTicks = getSingleAxisTicks(0, maxYValue, 5);
    const yScale = scaleLinear()
        .domain([0, yTicks.slice(-1)[0]])
        .range([plotBottom, plotTop]);
    const xScale = scalePoint().domain(groupNames).rangeRound([plotLeft, plotRight]).padding(0.5);

    return (
        <div ref={chartContainerRef} className={chartContainer}>
            <svg width={chartWidth} height={height}>
                {hasNoData ? (
                    <NoData />
                ) : (
                    <>
                        <BarChartXAxis scale={xScale} top={plotBottom} />
                        <BarChartYAxis
                            scale={yScale}
                            ticks={yTicks}
                            left={plotLeft}
                            labelFormatter={labelFormatter}
                            ref={yAxisRef}
                        />
                        <HorizontalGrid scale={yScale} ticks={yTicks} left={plotLeft} width={plotRight - plotLeft} />
                        <g data-name="plotArea">
                            {chartData.map(({groupName, groupValues}) => (
                                <g key={groupName}>
                                    {groupValues.some(Boolean) ? (
                                        stackValues(groupValues).map(([start, end], index) => (
                                            <rect
                                                key={index}
                                                fill={colors[index]}
                                                x={Number(xScale(groupName)) - barWidth / 2}
                                                y={yScale(end)}
                                                width={barWidth}
                                                height={Math.abs(yScale(start) - yScale(end))}
                                            />
                                        ))
                                    ) : (
                                        <text
                                            className={chartText}
                                            x={xScale(groupName)}
                                            y={yScale(0)}
                                            dy="-0.3em"
                                            textAnchor="middle">
                                            n/a
                                        </text>
                                    )}
                                </g>
                            ))}
                        </g>
                    </>
                )}
            </svg>
        </div>
    );
};

export default React.memo(BarChartStacked);
