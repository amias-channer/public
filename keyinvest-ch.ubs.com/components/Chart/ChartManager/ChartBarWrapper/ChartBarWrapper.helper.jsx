import { path } from 'ramda';
import Chartist from 'chartist';
import { formatNumber } from '../../../../utils/utils';
import { DEFAULT_DECIMAL_DIGITS } from '../../../PushManager/PushableDefault/PushableDefault.helper';

export const getBarStrokeWidth = (data) => {
  let strokeWidth = 100;
  if (data) {
    const count = path(['set', '0', 'dat', 'length'])(data);
    if (count) {
      strokeWidth = 100 / count;
    }
  }
  return strokeWidth < 25 ? 25 : strokeWidth;
};

export const generateChartBarListeners = (data, labelDecimalDigits = DEFAULT_DECIMAL_DIGITS) => {
  const chartBarStrokeWidth = getBarStrokeWidth(data);
  return {
    draw(dt) {
      if (dt.type === 'bar') {
        dt.element.attr({
          style: `stroke-width: ${chartBarStrokeWidth}px;`,
        });
        dt.group.append(new Chartist.Svg('text', {
          x: dt.x2 - 10,
          y: dt.y2 - 8,
        }, 'ct-bar-val-text').text(`${formatNumber(Chartist.getMultiValue(dt.value), labelDecimalDigits, labelDecimalDigits)}%`));
      }
    },
  };
};

export const prepareChartistBarData = (config, responsiveMode) => {
  const { data, options } = config;
  if (data.set && Object.keys(data.set) && Object.keys(data.set).length > 0) {
    if (data.set[0].dat) {
      const labels = [];
      const series = [];
      data.set[0].dat.forEach((p) => {
        labels.push(p.name);
        series.push(p.value);
      });
      const chartData = {
        labels,
        series,
      };
      const defaultChartOptions = {
        responsiveMode,
        distributeSeries: true,
        high: 100,
        low: 0,
        height: 410,
        axisY: {
          onlyInteger: true,
          type: Chartist.FixedScaleAxis,
          ticks: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
        },
      };
      return {
        chartData,
        chartOptions: {
          ...defaultChartOptions,
          ...options, // override chart options passed from the concrete implementation of bar chart
        },
      };
    }
  }
  return null;
};
