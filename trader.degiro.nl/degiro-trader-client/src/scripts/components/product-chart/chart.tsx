import {logErrorLocally} from 'frontend-core/dist/loggers/local-logger';
import {logErrorRemotely} from 'frontend-core/dist/loggers/remote-logger';
import createCancellablePromise from 'frontend-core/dist/utils/async/create-cancellable-promise';
import * as React from 'react';
import {Unsubscribe, unsubscribeAll} from '../../event-broker/subscription';
import {VwdApiEvent, VwdChart, VwdChartOptions, VwdChartPoint, VwdChartTypes} from '../../models/vwd-api';
import getVwdChartApi from '../../services/vwd-chart/get-vwd-chart-api';
import {MainClientContext} from '../app-component/app-context';
import {Series} from './get-chart-series-from-product-info';
import {VwdChartUpdateOptions} from './index';
import {chart as chartClassName} from './product-chart.css';
import scheduleChartSizeCalculation from './schedule-chart-size-calculation';

type VwdChartEventHandlerArguments = [VwdApiEvent, VwdChartPoint | undefined];

interface Props {
    className?: string;
    series: (Series | undefined)[];

    chartType: VwdChartTypes;
    options: VwdChartUpdateOptions;
    onPointSelect?: (...args: VwdChartEventHandlerArguments) => void;
    onOptionsChange?: (chart: VwdChart, options: VwdChartUpdateOptions) => void;
}

const {useEffect, useState, useContext, useRef, memo} = React;
const noop = () => undefined;
const errorHandler = (event: VwdApiEvent | undefined) => {
    if (!event) {
        return;
    }

    // stop VWD errors handler
    event.preventDefault();

    logErrorRemotely({
        message: event.message,
        reason: event.reason,
        cause: event.cause
    });
};
const Chart: React.FunctionComponent<Props> = (props) => {
    const mainClient = useContext(MainClientContext);
    const {options, className = '', chartType, onPointSelect = noop, onOptionsChange = noop} = props;
    const chartRef = useRef<HTMLDivElement>(null);
    const series: Series[] = props.series.filter((el) => el !== undefined) as Series[];
    const [chart, setChart] = useState<VwdChart>();

    useEffect(() => {
        if (!chart || series.length === 0) {
            return;
        }

        const firstChartSeries = chart.series?.[0];
        const secondChartSeries = chart.series?.[1];
        const secondPropSeries = series[1];

        chart.update(options);

        firstChartSeries.dataseries?.[0]?.update({
            type: chartType,
            ...series[0].style
        });

        if (secondChartSeries && !secondPropSeries) {
            return secondChartSeries.remove();
        }

        if (!secondChartSeries && secondPropSeries) {
            return chart.series.add(secondPropSeries);
        }

        if (secondChartSeries && secondPropSeries) {
            secondChartSeries.remove();
            return chart.series.add(secondPropSeries);
        }

        onOptionsChange(chart, options);
    }, [chart, options, series, onOptionsChange]);

    useEffect(() => {
        if (!chart) {
            return;
        }
        chart.on('dataseriesclicked', onPointSelect);
        return () => chart.off('dataseriesclicked', onPointSelect);
    }, [chart, onPointSelect]);
    useEffect(() => {
        if (series.length === 0 || !chartRef.current) {
            return;
        }
        const chartApiPromise = createCancellablePromise(getVwdChartApi(mainClient));
        const unsubscribeList: Unsubscribe[] = [chartApiPromise.cancel];

        chartApiPromise.promise
            .then((chartApi: VwdChart | undefined) => {
                // [SENTRY-716]
                if (!chartApi || typeof chartApi.create !== 'function') {
                    return;
                }

                const chartOptions: VwdChartOptions = {
                    target: chartRef.current as HTMLDivElement,
                    template: 'chart',
                    series: series.map(({key}) => key)
                };

                if (options.period) {
                    chartOptions.period = options.period;
                }

                const chart = chartApi.create(chartOptions);

                chart.on('dataerror', errorHandler);
                chart.on('error', errorHandler);

                unsubscribeList.push(scheduleChartSizeCalculation(chart), () => {
                    // VWD api.js and template.js have some bugs and may trigger global errors
                    try {
                        chart.off();
                        chart.destroy();
                    } catch (error) {
                        logErrorRemotely(error);
                    }
                });

                chart.on('initcomplete', () => setChart(chart));
            })
            .catch(logErrorLocally);

        return () => unsubscribeAll(unsubscribeList);
    }, []);

    return <div ref={chartRef} data-name="vwdChart" className={`${chartClassName} ${className}`} />;
};

export default memo(Chart);
