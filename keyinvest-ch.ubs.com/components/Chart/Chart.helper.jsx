import Chartist from 'chartist';
import {
  mergeDeepRight, clone, filter, concat, pathOr,
} from 'ramda';
import Logger from '../../utils/logger';
import { DEFAULT_DECIMAL_DIGITS } from '../PushManager/PushableDefault/PushableDefault.helper';
import { formatNumber } from '../../utils/utils';

export const TIMESPAN_1D = '1D';
export const TIMESPAN_1W = '1W';
export const TIMESPAN_2W = '2W';
export const TIMESPAN_1M = '1M';
export const TIMESPAN_3M = '3M';
export const TIMESPAN_6M = '6M';
export const TIMESPAN_1Y = '1Y';
export const TIMESPAN_YTD = 'YTD';
export const TIMESPAN_3Y = '3Y';
export const TIMESPAN_5Y = '5Y';
export const TIMESPAN_30Y = '30Y';
export const TIMESPAN_MAX = 'Max';

export const CHART_MODE_RELATIVE = 'rel';
export const CHART_MODE_ABSOLUTE = 'abs';
export const getSuffixByMode = (mode) => (mode === CHART_MODE_RELATIVE ? '%' : '');

export const DEFAULT_CHART_TIMESPAN = TIMESPAN_5Y;
export const DEFAULT_CHART_TIMESPANS_OPTIONS = [
  TIMESPAN_1D,
  TIMESPAN_1W,
  TIMESPAN_1M,
  TIMESPAN_3M,
  TIMESPAN_1Y,
  TIMESPAN_5Y,
  TIMESPAN_MAX,
];

export const CHART_SHORTMONTH = [
  'Jan',
  'Feb',
  'Mär',
  'Apr',
  'Mai',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Okt',
  'Nov',
  'Dez',
];

export const DYNAMIC_TARGETLINES = [{
  label: 'Cash',
  id: 'deri-neutral-max',
  value: 'max',
  toValue: 1.25,
}, {
  label: 'Long',
  id: 'deri-bullish',
  lineAlpha: 0,
  value: 1.25,
  toValue: -0.75,
}, {
  label: 'Cash',
  id: 'deri-neutral',
  lineAlpha: 0,
  value: -0.75,
  toValue: -1.25,
}, {
  label: 'Short',
  id: 'deri-bearish',
  lineAlpha: 0,
  value: -1.25,
  toValue: -2,
}, {
  label: 'Cash',
  id: 'deri-neutral-min',
  lineAlpha: 0,
  value: -2,
  toValue: 'min',
}];

export const GLOBAL_TARGETLINES = [{
  label: 'Bullish',
  id: 'deri-bullish-global',
  lineAlpha: 0,
  value: 4,
  toValue: 0.001,
}, {
  label: 'Neutral',
  id: 'deri-neutral-min',
  lineAlpha: 0,
  value: 0.001,
  toValue: 'min',
}];

export const calculatePercents = (value, baseValue) => {
  if (value === '-') return null;
  return value && baseValue ? (value / baseValue) * 100 - 100 : null;
};

export const closestMatch = (arr, goal) => {
  const match = arr.reduce((prev, curr) => (
    Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev
  ));
  return match || null;
};

export const getDeriTargetLines = (data, settings) => {
  const defaultSettings = {
    align: 'rect',
    visible: true,
    labelOffset: {
      x: 35,
      y: -4,
    },
  };
  return data.map((t) => Object.assign(t, defaultSettings, settings));
};

export const getPreviousClose = (value) => [{
  label: 'PreviousClose',
  id: 'previous-close',
  value,
  hideLabel: true,
  labelOffset: {
    x: 0,
    y: 0,
  },
}];

export const getInitialTargetLines = (data) => {
  const fixingDate = filter((d) => d.id === 'fixingDate', data)[0];
  if (fixingDate) {
    const labelDate = new Date(fixingDate.date);
    let day = labelDate.getDate();
    let month = labelDate.getMonth() + 1;
    const year = labelDate.getFullYear();
    day = day < 10 ? `0${day}` : day;
    month = month < 10 ? `0${month}` : month;

    fixingDate.align = 'vertical';
    fixingDate.visible = true;
    fixingDate.value = fixingDate.date;
    fixingDate.label = `${fixingDate.label}: ${day}.${month}.${year}`;
    fixingDate.labelOffset = {
      x: 0,
      y: 12,
    };
  }
  const barrierLevelRelativePer = filter((d) => d.id === 'barrierLevelRelativePercent', data)[0];
  if (barrierLevelRelativePer) {
    barrierLevelRelativePer.visible = true;
    barrierLevelRelativePer.label = `${barrierLevelRelativePer.label}: `;
    barrierLevelRelativePer.label += `${Number(barrierLevelRelativePer.value).toFixed(2)}%`;
    barrierLevelRelativePer.labelOffset = {
      x: 0,
      y: -4,
    };
  }

  return [
    fixingDate,
    barrierLevelRelativePer,
  ];
};

export const getYProp = (data, mode) => {
  const props = Object.keys(data);
  const meta = props.indexOf('meta') !== -1;
  return mode === CHART_MODE_ABSOLUTE && meta ? 'meta' : Object.keys(data)[1];
};

export const isValidNumber = (val) => !(Number.isNaN(val) || val === '-');

export const formatSeries = (data, mode, baseValue, isProductChart = true) => {
  const yProp = getYProp(data[0], mode);
  const dataFormatted = [];
  data.forEach((tick) => {
    const point = {
      x: tick.date || tick.x,
      y: mode === CHART_MODE_ABSOLUTE ? tick[yProp] : calculatePercents(tick[yProp], baseValue),
      meta: tick.meta || tick.value,
    };

    if (!isProductChart
      || (
        point
        && point.x
        && isValidNumber(point.y)
      )) {
      dataFormatted.push(point);
    }
  });

  return dataFormatted;
};
export const getFirstAvailableValue = (list, property) => {
  if (list && list.length) {
    let i;
    for (i = 0; i < list.length; i += 1) {
      if (isValidNumber(list[i][property])) {
        return list[i][property];
      }
    }
  }
  return null;
};

export const getBaseValue = (instrument) => {
  if (instrument && instrument.rpa) {
    return instrument.rpa;
  }
  Logger.warn('Chart.helper::generateSeries: Unable to find baseValue (rpa) for sin', instrument.sin);
  if (instrument && instrument.data && instrument.data.length) {
    return getFirstAvailableValue(instrument.data, 'meta');
  }
  if (instrument && instrument.dat && instrument.dat.length) {
    return getFirstAvailableValue(instrument.dat, 'value');
  }
  return null;
};

export const recalculateData = (chart) => {
  const dataSets = chart.data.series;
  const dataSetsVisible = filter((set) => set.visible, dataSets);

  chart.options.mode = pathOr(
    dataSetsVisible.length > 1 ? CHART_MODE_RELATIVE : CHART_MODE_ABSOLUTE,
    ['options', 'forcedMode'],
    chart,
  );

  const decimalDigits = pathOr(DEFAULT_DECIMAL_DIGITS, ['rawData', 'dig'], chart);

  const suffix = getSuffixByMode(chart.options.mode);
  chart.options.axisY.labelInterpolationFnc = (value) => formatNumber(
    value, decimalDigits, decimalDigits,
  ) + suffix;

  dataSets.forEach((instrument) => {
    const seriesData = formatSeries(
      instrument.data,
      chart.options.mode,
      getBaseValue(instrument),
    );
    instrument.data = seriesData;
  });
};

/**
 * Method to determine if the data is for the product chart or underlyings chart
 * @param data
 * @returns {boolean}
 */
const determineIfIsProductChartFromData = (data) => !(data && data.length > 1);

export const generateSeries = (rawData, chartOptions = {}) => {
  const data = JSON.parse(JSON.stringify(rawData));
  const dataSets = data.set.filter((set) => set.dat.length);
  // let targetLines = clone(data.gde) || [];
  let targetLines = [];

  const chartMode = chartOptions.forcedMode
    || (dataSets.length > 1 ? CHART_MODE_RELATIVE : CHART_MODE_ABSOLUTE);

  if (data.gde && data.gde.length && chartMode === CHART_MODE_RELATIVE) {
    targetLines = concat(getInitialTargetLines(data.gde), targetLines);
  }

  if (dataSets && dataSets.length && dataSets[0].til.indexOf('UBS Dynamic Equity Risk Indicator') > -1) {
    targetLines = concat(getDeriTargetLines(DYNAMIC_TARGETLINES), targetLines);
  } else if (dataSets[0].til.indexOf('UBS Global Emerging Markets Dynamic Equity Risk Indicator') > -1) {
    targetLines = concat(
      getDeriTargetLines(
        GLOBAL_TARGETLINES,
        { labelOffset: { x: 43, y: -4 } },
      ),
      targetLines,
    );
  }

  const series = [];
  const isProductChart = determineIfIsProductChartFromData(dataSets);
  dataSets.forEach((instrument, index) => {
    const baseValue = getBaseValue(instrument);
    const seriesData = formatSeries(
      instrument.dat,
      chartMode,
      baseValue,
      isProductChart,
    );
    const instrumentData = {
      id: index,
      sin: instrument.sin,
      name: instrument.til,
      color: instrument.col,
      rpa: baseValue,
      visible: true,
      data: seriesData,
    };
    series.push(instrumentData);

    if (chartMode === CHART_MODE_ABSOLUTE && instrument.gde) {
      instrument.gde.forEach((g) => targetLines.push(g));
    }

    if (chartMode === CHART_MODE_ABSOLUTE && instrument.pre) {
      targetLines = concat(getPreviousClose(instrument.pre), targetLines);
    }
  });
  return {
    series,
    targetLines,
  };
};

export const getDateFromTimespan = (date, timespan, format) => {
  let newDate = new Date(date.getTime());
  switch (timespan) {
    case TIMESPAN_1D:
      newDate.setDate(date.getDate() - 7);
      break;
    case TIMESPAN_2W:
      newDate.setDate(date.getDate() - 14);
      break;
    case TIMESPAN_1M:
      newDate.setMonth(date.getMonth() - 1);
      break;
    case TIMESPAN_3M:
      newDate.setMonth(date.getMonth() - 3);
      break;
    case TIMESPAN_6M:
      newDate.setMonth(date.getMonth() - 6);
      break;
    case TIMESPAN_YTD:
      newDate = new Date(date.getFullYear(), 0, 1);
      break;
    case TIMESPAN_1Y:
      newDate.setFullYear(date.getFullYear() - 1);
      break;
    case TIMESPAN_3Y:
      newDate.setFullYear(date.getFullYear() - 3);
      break;
    case TIMESPAN_5Y:
      newDate.setFullYear(date.getFullYear() - 5);
      break;
    case TIMESPAN_30Y:
    case TIMESPAN_MAX:
      newDate.setFullYear(date.getFullYear() - 30);
      break;
    default:
      return false;
  }

  if (format === 'timestamp') {
    return newDate.getTime();
  }
  return newDate;
};

export const getAxisXHighLowByTimespan = (data, timespan) => {
  if (
    data && data.series && data.series.length
    && data.series[0]
    && data.series[0].data
    && data.series[0].data.length
  ) {
    const dataLength = data.series[0].data.length - 1;
    const low = closestMatch(
      data.series[0].data.map((i) => i.x),
      getDateFromTimespan(
        new Date(data.series[0].data[dataLength].x),
        timespan,
        'timestamp',
      ),
    );
    return {
      low,
      lowIndex: data.series[0].data.findIndex((i) => i.x === low),
      highIndex: dataLength,
    };
  }
  return null;
};

export const getYAxisHighLowByTimespan = (timespan) => {
  const Y_AXIS_DEFAULT_HIGH_LOW_PERCENT = 5;
  if (timespan === TIMESPAN_1D) {
    return 0.2;
  }
  return Y_AXIS_DEFAULT_HIGH_LOW_PERCENT;
};

export const generateOptions = (
  chartData, chartOptions,
  timespan, responsiveMode,
  decimalDigits = DEFAULT_DECIMAL_DIGITS,
) => {
  if (!chartData || !chartData.series || !chartData.series.length) return null;
  chartOptions.axisX = { ...chartOptions.axisX, ...getAxisXHighLowByTimespan(chartData, timespan) };
  const options = clone(chartOptions);
  const prevClose = filter((p) => p.id === 'previous-close', chartData.targetLines);
  let activePlugins = [];
  if (Chartist && Chartist.plugins) {
    activePlugins = [
      Chartist.plugins.colors(),
      Chartist.plugins.dynamicXAxis({ shortMonth: CHART_SHORTMONTH }),
      Chartist.plugins.dynamicYAxis(chartData, options),
      Chartist.plugins.targetline(chartData.targetLines),
      Chartist.plugins.timespans(),
    ];
    if (options.showTooltip) {
      activePlugins.push(Chartist.plugins.tooltip());
    }
    if (!options.hideGridColor) {
      activePlugins.push(Chartist.plugins.gridcolor());
    }
    if (options.greenRedPushableChart && prevClose.length) {
      options.threshold = prevClose[0].value;
      activePlugins.push(Chartist.plugins.ctThreshold());
    }
  }

  const defaultMode = filter((set) => set.visible, chartData.series).length > 1
    ? CHART_MODE_RELATIVE : CHART_MODE_ABSOLUTE;

  const mode = pathOr(defaultMode, ['forcedMode'], chartOptions);
  options.suffix = getSuffixByMode(mode);

  const defaultOptions = {
    responsiveMode,
    mode,
    plugins: activePlugins,
    showPoint: true,
    showScrollbar: false,
    showTimespans: false,
    timespans: undefined,
    defaultTimespan: TIMESPAN_MAX,
    showTooltip: false,
    axisY: {
      showLabel: true,
      showGrid: true,
      type: Chartist.none,
      scaleMinSpace: 40,
      position: 'end',
      highLowOffset: getYAxisHighLowByTimespan(timespan),
      low: options.preRenderY ? options.preRenderY.low : undefined,
      high: options.preRenderY ? options.preRenderY.high : undefined,
      labelOffset: { x: 0, y: 12 },
      labelInterpolationFnc(value) {
        return formatNumber(
          value, decimalDigits, decimalDigits,
        ) + options.suffix;
      },
    },
    axisX: {
      showLabel: true,
      showGrid: true,
      type: timespan === TIMESPAN_1W ? Chartist.none : Chartist.FixedScaleAxis,
      labelOffset: { x: 0, y: 10 },
      divisor: 5,
      low: options.preRenderX ? options.preRenderX.low : undefined,
      high: options.preRenderX ? options.preRenderX.high : undefined,
      labelInterpolationFnc(value) {
        return new Date(value).getFullYear();
      },
    },
    fullWidth: true,
    chartPadding: {
      top: 0,
      right: 30,
      bottom: 0,
      left: 1,
    },
    lineSmooth: Chartist.Interpolation.none({
      fillHoles: true,
    }),
    height: 370,
    targetLines: {
      labelOffset: {
        x: 0,
        y: -4,
      },
    },
    maxSeries: 7440000,
  };

  return mergeDeepRight(defaultOptions, options);
};

export const getScrollbarOptions = () => ({
  chartPadding: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  axisX: {
    type: Chartist.FixedScaleAxis,
    divisor: 0,
    offset: 0,
    showLabel: true,
    showGrid: true,
    labelInterpolationFnc(date) {
      let formattedDate = new Date(Number(date));
      const year = formattedDate.getFullYear();
      formattedDate = `${year}`;
      return formattedDate;
    },
  },
  axisY: {
    onlyInteger: true,
    offset: 0,
    showLabel: false,
    showGrid: false,
  },
  height: 40,
  showArea: true,
  lineSmooth: Chartist.Interpolation.none({
    fillHoles: true,
  }),
});

export const setZoom = (chart, values) => {
  try {
    chart.options.axisX.highLow = {
      low: chart.data.series[0].data[values[0]].x,
      high: chart.data.series[0].data[values[1]].x,
    };
    chart.options.axisX.rangeIndex = {
      low: values[0],
      high: values[1],
    };

    chart.eventEmitter.emit('zoomed', {
      type: 'scrollbar',
      axisX: chart.options.axisX,
      axisY: chart.options.axisY,
    });

    chart.update(null, chart.options);
  } catch (e) {
    Logger.warn(e);
  }
};

export const recalculateDataOnZoom = (chart, values) => {
  chart.data.series.every((instrument) => {
    if (!instrument.data.length) return false;
    let baseValue = instrument.data[values[0]].meta;
    if (baseValue === '-') {
      baseValue = getFirstAvailableValue(instrument.data, 'meta');
    }
    const newData = instrument.data.map((d) => ({
      date: d.x,
      value: d.meta,
    }));
    instrument.data = formatSeries(
      newData,
      CHART_MODE_RELATIVE,
      baseValue,
    );
    return true;
  });
};
