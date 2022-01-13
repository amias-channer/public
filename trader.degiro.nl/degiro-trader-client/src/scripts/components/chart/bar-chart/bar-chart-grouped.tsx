import {scaleLinear, scalePoint} from 'd3-scale';
import useElementSize, {ElementSize} from 'frontend-core/dist/hooks/use-element-size';
import getCurrencySymbol from 'frontend-core/dist/utils/currency/get-currency-symbol';
import omitNullable from 'frontend-core/dist/utils/omit-nullable';
import * as React from 'react';
import {BarChartPoint, PlotOffset} from '../../../models/chart';
import BarChartXAxis from './bar-chart-x-axis';
import BarChartYAxis, {ChartLabelFormatter} from './bar-chart-y-axis';
import {chartContainer, chartText} from './bar-chart.css';
import {grid, yTickPadding} from '../constants';
import getBarWidth from './get-bar-width';
import getSingleAxisTicks from './get-single-axis-ticks';
import HorizontalGrid from './horizontal-grid';
import NoData from './no-data';

const {useRef, useCallback} = React;

interface Props {
    chartData: BarChartPoint[];
    currency?: string;
    labelFormatter?: ChartLabelFormatter;
    colors: string[];
}

const getMinYValue = (chartData: BarChartPoint[]): number =>
    Math.min(...chartData.map((dataPoint) => Math.min(...omitNullable(dataPoint.groupValues))));
const getMaxYValue = (chartData: BarChartPoint[]): number =>
    Math.max(...chartData.map((dataPoint) => Math.max(...omitNullable(dataPoint.groupValues))));
const chartHeight = 50 * grid;
const plotOffset: PlotOffset = {bottom: 5 * grid, top: 5 * grid, left: 2 * grid, right: 0};
const BarChartGrouped: React.FunctionComponent<Props> = ({chartData, labelFormatter = String, currency, colors}) => {
    // container
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartContainerSize: ElementSize | undefined = useElementSize(chartContainerRef);
    const chartWidth = chartContainerSize?.width || 0;
    // yAxis
    const yAxisRef = useRef<SVGGElement>(null);
    const yAxisSize: ElementSize | undefined = useElementSize(yAxisRef);
    const yAxisWidth = yAxisSize?.width || 0;
    // plot dimensions
    const plotTop = plotOffset.top;
    const plotRight = chartWidth - plotOffset.right;
    const plotBottom = chartHeight - plotOffset.bottom;
    const plotLeft = plotOffset.left + yAxisWidth;
    const plotWidth = plotRight - plotLeft;
    // groups
    const groupNames = chartData.map((point) => point.groupName);
    const groupElementsCount = chartData[0]?.groupValues.length || 0;
    const barWidth = getBarWidth(plotWidth, groupElementsCount * chartData.length);
    const groupWidth = barWidth * groupElementsCount;
    const hasNoData = groupElementsCount === 0;
    // scales
    const maxYValue: number = hasNoData ? 0 : getMaxYValue(chartData);
    const minYValue: number = hasNoData ? 0 : getMinYValue(chartData);
    const yTicks = getSingleAxisTicks(minYValue, maxYValue, 7);
    const yScale = scaleLinear()
        .domain([yTicks[0], yTicks.slice(-1)[0]])
        .range([plotBottom, plotTop]);
    const xScale = scalePoint().domain(groupNames).rangeRound([plotLeft, plotRight]).padding(0.5);
    const groupScale = scaleLinear().domain([0, groupElementsCount]).rangeRound([0, groupWidth]);
    const yBaseValue = Math.max(yScale.domain()[0], 0);
    // format
    const handleLabelFormat = useCallback<ChartLabelFormatter>(
        (currentValue, index, allValues) => (index === 0 ? '' : labelFormatter(currentValue, index, allValues)),
        [labelFormatter]
    );

    return (
        <div ref={chartContainerRef} className={chartContainer}>
            <svg width={chartWidth} height={chartHeight}>
                {hasNoData ? (
                    <NoData />
                ) : (
                    <>
                        <BarChartXAxis scale={xScale} top={plotBottom} />
                        <BarChartYAxis
                            scale={yScale}
                            ticks={yTicks}
                            left={plotLeft}
                            labelFormatter={handleLabelFormat}
                            ref={yAxisRef}>
                            {currency && (
                                <text
                                    className={chartText}
                                    x={-yTickPadding}
                                    y={plotBottom}
                                    textAnchor="end"
                                    dominant-baseline="hanging">
                                    {getCurrencySymbol(currency)}
                                </text>
                            )}
                        </BarChartYAxis>
                        <HorizontalGrid scale={yScale} ticks={yTicks} left={plotLeft} width={plotRight - plotLeft} />
                        <g data-name="plotArea">
                            {chartData.map(({groupName, groupValues}) => (
                                <g
                                    key={groupName}
                                    transform={`translate(${Number(xScale(groupName)) - groupWidth / 2},0)`}>
                                    {groupValues.map((value, index) => {
                                        return value == null ? (
                                            <text
                                                key={index}
                                                className={chartText}
                                                x={groupScale(index)}
                                                dx={barWidth / 2}
                                                y={yScale(yBaseValue)}
                                                dy="-0.3em"
                                                textAnchor="middle">
                                                n/a
                                            </text>
                                        ) : (
                                            <rect
                                                key={index}
                                                fill={colors[index]}
                                                x={groupScale(index)}
                                                y={value > 0 ? yScale(value) : yScale(0)}
                                                width={barWidth}
                                                height={Math.abs(yScale(yBaseValue) - yScale(value))}
                                            />
                                        );
                                    })}
                                </g>
                            ))}
                        </g>
                    </>
                )}
            </svg>
        </div>
    );
};

export default React.memo(BarChartGrouped);
