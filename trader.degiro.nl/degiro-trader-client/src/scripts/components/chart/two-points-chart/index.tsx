import formatNumber, {NumberFormattingOptions} from 'frontend-core/dist/utils/number/format-number';
import {scaleLinear, ScaleLinear, scalePoint, ScalePoint} from 'd3-scale';
import useElementSize, {ElementSize} from 'frontend-core/dist/hooks/use-element-size';
import * as React from 'react';
import BarChartXAxis from '../bar-chart/bar-chart-x-axis';
import BarChartYAxis, {ChartLabelFormatter} from '../bar-chart/bar-chart-y-axis';
import {ConfigContext} from '../../app-component/app-context';
import {grid} from '../constants';
import TrendLine from '../trend-line';
import getExtremes from './get-extremes-relative-range';
import getFractionSize from './get-fraction-size';
import getValues from './get-values';
import HorizontalGrid from '../bar-chart/horizontal-grid';
import {PlotOffset, Point} from '../../../models/chart';
import SvgTooltip, {TooltipPosition} from '../svg-tooltip';
import {
    chartContainer,
    dashedCircle,
    innerCircle,
    outerCircle,
    label,
    textXAxis,
    textYAxis,
    tooltipContent,
    tooltipDowntrend,
    tooltipUptrend
} from './two-points-chart.css';

type Optional<T> = T | undefined;
export interface TwoPointsChartProps {
    chartLabel?: React.ReactNode;
    className?: string;
    chartLabelClassName?: string;
    leftFigureValue: Optional<number>;
    leftFigureLabel: string;
    rightFigureValue: Optional<number>;
    rightFigureLabel: string;
}

const chartHeight: number = 33 * grid;
const largeCircleRadius: number = 5 * grid; // should be aligned with 'two-points-chart.css'
const plotOffset: PlotOffset = {bottom: 2 * grid, top: 4 * grid, left: 2 * grid, right: 2 * grid};
const {useCallback, useContext, useMemo, useRef, useState} = React;
const TwoPointsChart: React.FunctionComponent<TwoPointsChartProps> = ({
    chartLabel,
    className = '',
    chartLabelClassName = '',
    leftFigureValue,
    leftFigureLabel,
    rightFigureValue,
    rightFigureLabel
}) => {
    const config = useContext(ConfigContext);
    const [leftTooltipSize, setLeftTooltipSize] = useState<ElementSize>({height: 0, width: 0});
    const [rightTooltipSize, setRightTooltipSize] = useState<ElementSize>({height: 0, width: 0});
    const fractionSize: number = getFractionSize([leftFigureValue, rightFigureValue]);
    const yAxisValues: number[] = useMemo(() => {
        if (!leftFigureValue && !rightFigureValue) {
            return [-20, -10, 0, 10, 20];
        }

        const numberOfValues: number = 5;

        if (leftFigureValue === rightFigureValue || leftFigureValue === undefined || rightFigureValue === undefined) {
            const baseValue = (leftFigureValue || rightFigureValue) as number;

            return getValues({min: baseValue * 0.8, max: baseValue * 1.2, numberOfValues, fractionSize});
        }

        const {min, max} = getExtremes({firstValue: leftFigureValue, secondValue: rightFigureValue});

        return getValues({min, max, numberOfValues, fractionSize});
    }, [fractionSize, leftFigureValue, rightFigureValue]);
    const formattingOptions: NumberFormattingOptions = useMemo(
        () => ({
            fractionDelimiter: config.fractionDelimiter || '.',
            fractionSize,
            thousandDelimiter: config.thousandDelimiter || ',',
            roundSize: fractionSize
        }),
        [config.fractionDelimiter, config.thousandDelimiter, fractionSize]
    );
    const minFractionSize: number = yAxisValues.every((value) => value - Math.floor(value) === 0) ? 0 : fractionSize;
    const handleLabelFormat = useCallback<ChartLabelFormatter>(
        (value) => formatNumber(value, {...formattingOptions, minFractionSize}),
        [formattingOptions, fractionSize, minFractionSize]
    );
    // container
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartContainerSize: ElementSize | undefined = useElementSize(chartContainerRef);
    const chartWidth: number = chartContainerSize?.width || 75 * grid;
    // bottom x axis
    const bottomXAxisRef = useRef<SVGGElement>(null);
    const bottomXAxisSize: ElementSize | undefined = useElementSize(bottomXAxisRef);
    const bottomXAxisHeight: number = bottomXAxisSize?.height || 0;
    const bottomXAxisTop: number = chartHeight - plotOffset.bottom - bottomXAxisHeight;
    // left y axis
    const leftYAxisRef = useRef<SVGGElement>(null);
    const leftYAxisSize: ElementSize | undefined = useElementSize(leftYAxisRef);
    const leftYAxisWidth: number = leftYAxisSize?.width || 0;
    // plot dimensions
    const plotTop: number = plotOffset.top;
    const plotRight: number = chartWidth - plotOffset.right;
    const plotBottom: number = bottomXAxisTop - plotOffset.bottom;
    const plotLeft: number = leftYAxisWidth + plotOffset.left;
    const plotWidth: number = plotRight - plotLeft;
    // scales
    const xScale: ScalePoint<string> = useMemo(
        () => scalePoint().domain([leftFigureLabel, rightFigureLabel]).rangeRound([0, chartWidth]).padding(0.5),
        [chartWidth, leftFigureLabel, rightFigureLabel]
    );
    const yScale: ScaleLinear<number, number> = useMemo(
        () =>
            scaleLinear()
                .domain([yAxisValues[0], yAxisValues[yAxisValues.length - 1]])
                .range([plotBottom, plotTop]),
        [plotBottom, plotTop, yAxisValues]
    );
    // points
    const leftPoint: Optional<Point> = useMemo(() => {
        return leftFigureValue === undefined
            ? undefined
            : {x: plotLeft + leftTooltipSize.width, y: yScale(leftFigureValue) as number};
    }, [leftFigureValue, leftTooltipSize.width, plotLeft, yScale]);
    const rightPoint: Optional<Point> = useMemo(() => {
        return rightFigureValue === undefined
            ? undefined
            : {x: plotRight - (rightTooltipSize.width + largeCircleRadius), y: yScale(rightFigureValue) as number};
    }, [plotWidth, rightFigureValue, rightTooltipSize.width, yScale]);
    const leftTooltipPointerTip: Optional<Point> = useMemo(() => {
        return leftPoint && {...leftPoint, x: leftPoint.x - grid};
    }, [leftPoint]);
    const rightTooltipPointerTip: Optional<Point> = useMemo(() => {
        return rightPoint && {...rightPoint, x: rightPoint.x + largeCircleRadius + grid};
    }, [rightPoint]);

    return (
        <div ref={chartContainerRef} className={`${chartContainer} ${className}`}>
            <svg width={chartWidth} height={chartHeight}>
                <BarChartXAxis ref={bottomXAxisRef} scale={xScale} top={bottomXAxisTop} textClassName={textXAxis} />
                <BarChartYAxis
                    ref={leftYAxisRef}
                    labelFormatter={handleLabelFormat}
                    left={plotLeft}
                    scale={yScale}
                    ticks={yAxisValues}
                    textClassName={textYAxis}
                />
                <HorizontalGrid left={plotLeft} scale={yScale} ticks={yAxisValues} width={plotWidth} />
                {leftFigureValue !== undefined &&
                    rightFigureValue !== undefined &&
                    leftPoint &&
                    rightPoint &&
                    leftTooltipPointerTip &&
                    rightTooltipPointerTip && (
                        <>
                            <TrendLine
                                endCircleRadius={2}
                                endPoint={rightPoint}
                                height={chartHeight}
                                startCircleRadius={3}
                                startPoint={leftPoint}
                                width={chartWidth}
                            />
                            <SvgTooltip
                                content={formatNumber(leftFigureValue, formattingOptions)}
                                contentClassName={tooltipContent}
                                onTooltipSizeUpdate={setLeftTooltipSize}
                                horizontalPadding={2 * grid}
                                pointerSize={grid}
                                pointerTip={leftTooltipPointerTip}
                                position={TooltipPosition.LEFT}
                            />
                            <SvgTooltip
                                className={`${leftFigureValue < rightFigureValue ? tooltipUptrend : ''} ${
                                    leftFigureValue > rightFigureValue ? tooltipDowntrend : ''
                                }`}
                                content={formatNumber(rightFigureValue, formattingOptions)}
                                contentClassName={tooltipContent}
                                onTooltipSizeUpdate={setRightTooltipSize}
                                horizontalPadding={2 * grid}
                                pointerSize={grid}
                                pointerTip={rightTooltipPointerTip}
                                position={TooltipPosition.RIGHT}
                            />
                            <g data-name="innerCircle">
                                <circle
                                    className={`${dashedCircle} ${innerCircle}`}
                                    transform-origin="center"
                                    r="12"
                                    cx={rightPoint.x}
                                    cy={rightPoint.y}></circle>
                            </g>
                            <g data-name="outerCircle">
                                <circle
                                    className={`${dashedCircle} ${outerCircle}`}
                                    transform-origin="center"
                                    r="20"
                                    cx={rightPoint.x}
                                    cy={rightPoint.y}></circle>
                            </g>
                        </>
                    )}
            </svg>
            {chartLabel && <footer className={`${label} ${chartLabelClassName}`}>{chartLabel}</footer>}
        </div>
    );
};

export default React.memo(TwoPointsChart);
