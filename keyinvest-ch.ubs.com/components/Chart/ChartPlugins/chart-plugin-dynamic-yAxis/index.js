/* eslint no-undef: "off" */
const recalculateDataOnZoom = require("../../Chart.helper").recalculateDataOnZoom;
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['chartist'], (Chartist) => (root.returnExportsGlobal = factory(Chartist)));
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like enviroments that support module.exports,
    // like Node.
    module.exports = factory(require('chartist'));
  } else {
    root['Chartist.plugins.dynamicYAxis'] = factory(Chartist);
  }
}(this, (Chartist) => {
  /**
   * Chartist.js plugin to danymically adjust y-axis.
   *
   */
  /* global Chartist */

  (function (document, Chartist) {
    Chartist.plugins = Chartist.plugins || {};
    Chartist.plugins.dynamicYAxis = function (data, options) {
      getYAxisHighLow = (chartData, targetLines, range) => {
        let seriesHighLow = [];
        const sumHighLow = {};

        chartData.forEach((set) => {
          if (range && !set.data[range.high]) {
            const diffToLast = range.high - range.low;
            range.high = set.data.length - 1;
            range.low = set.data.length - 1 - diffToLast > 0 ? set.data.length - 1 - diffToLast : 0;
          }

          let dataSet = range ? set.data.slice(range.low, range.high) : set.data;
          if (chartData.length === 1) {
            dataSet = dataSet.filter((o) => !isNaN(o.y));
          }

          if (dataSet.length) {
            seriesHighLow.push(Math.min.apply(Math, dataSet.map((o) => o.y)));
            seriesHighLow.push(Math.max.apply(Math, dataSet.map((o) => o.y)));
          }
        });

        if (targetLines) {
          const targetLineValues = targetLines.filter((line) => line.align === 'horizontal' && line.visible).map((l) => l.value);
          seriesHighLow = seriesHighLow.concat(targetLineValues);
        }

        sumHighLow.high = Math.max.apply(Math, seriesHighLow);
        sumHighLow.low = Math.min.apply(Math, seriesHighLow);
        return sumHighLow;
      };

      getValueWithOffset = (value, percents) => {
        function calc(val, per) {
          return (val / 100) * per;
        }
        const high = value + calc(value, percents);
        const low = Math.sign(value) === -1
          ? value + calc(value, percents)
          : value - calc(value, percents);

        return { low, high };
      };

      setYAxis = (data, options, rangeIndex) => {
        const datasetsVisible = data.series.filter((set) => set.visible);
        const highLow = getYAxisHighLow(datasetsVisible, data.targetLines, rangeIndex);
        options.high = getValueWithOffset(
          highLow.high,
          options.highLowOffset,
        ).high;
        options.low = getValueWithOffset(
          highLow.low,
          options.highLowOffset,
        ).low;
        return options;
      };

      // Initial rendering
      const preRenderY = getYAxisHighLow(
        data.series,
        data.targetLines,
        {
          low: options.axisX.lowIndex,
          high: options.axisX.highIndex,
        },
      );
      options.preRenderY = {
        high: getValueWithOffset(preRenderY.high, 5).high,
        low: getValueWithOffset(preRenderY.low, 5).low,
      };

      return function dynamicYAxis(chart) {
        if (chart instanceof Chartist.Line || chart instanceof Chartist.Bar) {
          chart.on('zoomed', (data) => {
            if (
              chart.options.mode === 'rel' && 
              chart.options.timespan !== '1W' && 
              chart.options.timespan !== '1W'
            ) {
              recalculateDataOnZoom(chart, [data.axisX.rangeIndex.low]);
            }
            setYAxis(chart.data, chart.options.axisY, data.axisX.rangeIndex);
          });

          chart.on('updateYAxis', () => {
            setYAxis(chart.data, chart.options.axisY);
          });
        }
      };
    };
  }(document, Chartist));

  return Chartist.plugins.dynamicYAxis;
}));
