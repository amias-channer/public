import {VwdChart, VwdChartSerie} from '../../models/vwd-api';

type ConsoleLog = typeof console.log;

let originalConsoleLog: ConsoleLog | undefined;
let consoleLogWrappers: ConsoleLog[] = [];

function getFirstDataSet(chart: VwdChart): void | {update: Function; data?: {data?: [number, number][]}} {
    const serie: VwdChartSerie | undefined = chart.series[0];

    return serie && serie.dataseries && serie.dataseries[0];
}

export function getDataPointsRange(chart: VwdChart): void | [[number, number], [number, number]] {
    const firstDataSet = getFirstDataSet(chart);
    const dataPoints: void | [number, number][] = firstDataSet && firstDataSet.data && firstDataSet.data.data;

    // we have at least 2 points: start & end
    if (dataPoints && dataPoints[1]) {
        return [dataPoints[0], dataPoints[dataPoints.length - 1]];
    }
}

// TODO: remove console.log patch after update to the new charts
/* eslint-disable no-console */
export function wrapConsole(consoleLogWrapper: ConsoleLog) {
    if (typeof console !== 'undefined' && typeof console.log === 'function') {
        if (!originalConsoleLog) {
            originalConsoleLog = console.log;
            consoleLogWrappers = [];
            console.log = function consoleLog(...args: any[]) {
                originalConsoleLog?.apply(console, args);
                consoleLogWrappers.forEach((consoleLogWrapper: ConsoleLog) => consoleLogWrapper.apply(null, args));
            };
        }

        if (consoleLogWrappers.indexOf(consoleLogWrapper) < 0) {
            consoleLogWrappers.push(consoleLogWrapper);
        }
    }
}

export function unwrapConsole(consoleLogWrapper: ConsoleLog) {
    consoleLogWrappers = consoleLogWrappers.filter((consoleLog: ConsoleLog) => consoleLog !== consoleLogWrapper);

    if (!consoleLogWrappers.length) {
        if (originalConsoleLog) {
            console.log = originalConsoleLog;
        }

        originalConsoleLog = undefined;
        consoleLogWrappers = [];
    }
}
