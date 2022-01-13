/* eslint no-undef: "off"*/
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(["chartist"], function (Chartist) {
      return (root.returnExportsGlobal = factory(Chartist));
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like enviroments that support module.exports,
    // like Node.
    module.exports = factory(require("chartist"));
  } else {
    root['Chartist.plugins.timespans'] = factory(Chartist);
  }
}(this, function (Chartist) {

  /**
   * Chartist.js plugin to display a specific timespan on chart.
   *
   */
  /* global Chartist */
  (function (document, Chartist) {

    const ctSeriesNames =  ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o'];

    function closestMatch(arr, goal) {
      const match = arr.reduce((prev, curr) => (
        Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev
      ));
      return match || null;
    };

    Chartist.plugins = Chartist.plugins || {};
    Chartist.plugins.timespans = function (options) {

      return function timespans(chart) {
        if (chart instanceof Chartist.Line || chart instanceof Chartist.Bar) {

          function getDateFromTimespan(date, timespan, format) {
            let newDate = new Date(date.getTime());
            switch (timespan) {
              case '1W':
                newDate.setDate(date.getDate() - 7);
                break;
              case '2W':
                newDate.setDate(date.getDate() - 14);
                break;
              case '1M':
                newDate.setMonth(date.getMonth() - 1);
                break;
              case '3M':
                newDate.setMonth(date.getMonth() - 3);
                break;
              case '6M':
                newDate.setMonth(date.getMonth() - 6);
                break;
              case 'YTD':
                newDate = new Date(date.getFullYear(), 0, 1);
                break;
              case '1Y':
                newDate.setFullYear(date.getFullYear() - 1);
                break;
              case '3Y':
                newDate.setFullYear(date.getFullYear() - 3);
                break;
              case '5Y':
                newDate.setFullYear(date.getFullYear() - 5);
                break;
              case '30Y':
              case 'Max':
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

          function setZoom(range) {
            const dataSet = chart.data.series[0].data;
            const timestamps = dataSet.map((o) => o.x);
            const rangeMinMatch = closestMatch(timestamps, range.min);
            const rangeIndex = {
              low: timestamps.indexOf(rangeMinMatch),
              high: timestamps.indexOf(range.max),
            };

            chart.options.axisX.highLow = {
              low: rangeMinMatch,
              high: range.max,
            };

            chart.eventEmitter.emit('zoomed', {
              type: 'timespan',
              axisX: {
                low: rangeMinMatch,
                high: range.max,
                rangeIndex,
              }
            });
            
            chart.update(null, chart.options);
          }

          chart.on('zoomTo', function (data) {
            const lastDataPoint = chart.data.series[0].data[chart.data.series[0].data.length - 1];
            const range = {
              min: getDateFromTimespan(new Date(lastDataPoint.x), data.value, 'timestamp'),
              max: lastDataPoint.x,
            };
            chart.options.timespan = data.value;
            setZoom(range);
          });

          chart.on('created', function (data) {
            const dataSets = chart.data.series;
            dataSets.forEach((set) => {
              const dataSetCssClass = '.ct-series-' + ctSeriesNames[set.id];
              const element = chart.svg.querySelector(dataSetCssClass);
              if (set.visible) {
                element.removeClass('disabled');
              } else {
                element.addClass('disabled');
              }
            });
          });
        }
      };
    };

  }(document, Chartist));

  return Chartist.plugins.timespans;

}));
