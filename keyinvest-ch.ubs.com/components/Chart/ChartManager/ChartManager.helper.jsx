import {
  path, pathOr, reject,
} from 'ramda';
import Chartist from 'chartist';
import {
  CHART_MODE_RELATIVE,
  generateOptions,
  generateSeries,
  TIMESPAN_1D,
  TIMESPAN_1W,
} from '../Chart.helper';
import Logger from '../../../utils/logger';
import { prepareChartistBarData } from './ChartBarWrapper/ChartBarWrapper.helper';
import {
  calculateChangePercent,
  DEFAULT_DECIMAL_DIGITS,
} from '../../PushManager/PushableDefault/PushableDefault.helper';

export const CHART_INSTANCES_LOCATION = 'chartInstances';
export const CHART_INSTANCES_SOURCE = window;

const CHART_TYPE_BAR = 'Bar';

export const saveChartInstance = (uniqId, chartInstance) => {
  if (!CHART_INSTANCES_SOURCE[CHART_INSTANCES_LOCATION]) {
    CHART_INSTANCES_SOURCE[CHART_INSTANCES_LOCATION] = {};
  }
  if (!CHART_INSTANCES_SOURCE[CHART_INSTANCES_LOCATION][uniqId]) {
    CHART_INSTANCES_SOURCE[CHART_INSTANCES_LOCATION][uniqId] = {};
  }
  CHART_INSTANCES_SOURCE[CHART_INSTANCES_LOCATION][uniqId] = chartInstance;
};

export const getChartInstance = (uniqId) => path(
  [CHART_INSTANCES_LOCATION, uniqId],
)(CHART_INSTANCES_SOURCE);

export const destroyChartInstance = (uniqId) => {
  const chart = getChartInstance(uniqId);
  if (chart) {
    chart.detach();
    delete CHART_INSTANCES_SOURCE[CHART_INSTANCES_LOCATION][uniqId];
  }
};

export const getPushableChartUpdaterFieldFromDataSet = path(['pus']);
export const getChartDataSets = pathOr([], ['set']);

export const prepareChartistData = (config, responsiveMode) => {
  const { data } = config;
  if (data.set && Object.keys(data.set) && Object.keys(data.set).length > 0) {
    /* const reducedData = reduceData(
      data.set, data.set[0].dat.length > 3000 ? 650000000 : 43200000,
    ); */
    const reducedData = [];
    const isNotValid = (elm) => !elm || !elm.date || Number.isNaN(elm.value);
    data.set.forEach((set) => {
      reducedData.push(
        { ...set, dat: reject(isNotValid, set.dat) },
      );
    });
    const rawData = {
      ...data,
      set: reducedData, // data.set,
    };
    const decimalDigits = pathOr(DEFAULT_DECIMAL_DIGITS, ['dig'], rawData);
    const chartData = generateSeries(rawData, config.options);
    const chartOptions = generateOptions(
      chartData, config.options, config.timespan, responsiveMode, decimalDigits,
    );
    if (chartData && chartOptions) {
      return {
        chartData,
        chartOptions,
        rawData,
      };
    }
  }
  return null;
};

export const createChartistInstance = (uniqId, chartProps, chartRef, responsiveMode) => {
  const { type } = chartProps;
  let preparedChartData;
  if (type === CHART_TYPE_BAR) {
    preparedChartData = prepareChartistBarData(chartProps, responsiveMode);
  } else {
    preparedChartData = prepareChartistData(chartProps, responsiveMode);
  }
  if (preparedChartData) {
    const { chartData, chartOptions, rawData } = preparedChartData;
    const options = chartOptions || {};
    let event;
    if (Chartist && Chartist[type]) {
      const chartist = new Chartist[type](
        chartRef.current,
        chartData,
        options,
      );
      if (chartProps.listener) {
        // eslint-disable-next-line no-restricted-syntax
        for (event in chartProps.listener) {
          // eslint-disable-next-line no-prototype-builtins
          if (chartProps.listener.hasOwnProperty(event)) {
            if (chartist && typeof chartist.on === 'function') {
              chartist.on(event, chartProps.listener[event]);
            }
          }
        }
      }
      chartist.rawData = rawData;
      saveChartInstance(uniqId, chartist);
      return chartist;
    }
  }
  return null;
};

export const updateChartWithNewPushableValue = (uniqId, pushResult, chartSeriesIndex) => {
  if (chartSeriesIndex === null || chartSeriesIndex === undefined) {
    Logger.error('CHART_MANGER_HELPER::updateChartWithNewPushableValue : chartSeriesIndex not valid', chartSeriesIndex);
    return;
  }
  const chartInstance = getChartInstance(uniqId);
  const chartData = path(['data', 'series', chartSeriesIndex, 'data'])(chartInstance);
  if (
    chartInstance
    && pushResult
    && pushResult.value
    && pushResult.date
    && chartData
    && chartData.length > 0
  ) {
    let value;
    const chartMode = path(['options', 'mode'], chartInstance);
    if (chartMode === CHART_MODE_RELATIVE) {
      const rpa = path(['data', 'series', chartSeriesIndex, 'rpa'])(chartInstance);
      value = calculateChangePercent(rpa, pushResult.value);
    } else {
      value = pushResult.value;
    }
    const point = {
      x: pushResult.date,
      y: value,
      meta: value,
    };
    chartData.push(point);
    if (
      chartInstance.eventEmitter
      && chartInstance.eventEmitter.emit
      && typeof chartInstance.eventEmitter.emit === 'function'
    ) {
      chartInstance.eventEmitter.emit('updateXAxisLabelsCount', {});
    }
    chartInstance.update();
  }
};

export const getChartScrollBarSettings = (timespan) => {
  switch (timespan) {
    case TIMESPAN_1D:
    case TIMESPAN_1W:
      return false;
    default:
      return true;
  }
};
