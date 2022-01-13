/* eslint no-undef: "off" */
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
    root['Chartist.plugins.dynamicXAxis'] = factory(Chartist);
  }
}(this, (Chartist) => {
  /**
   * Chartist.js plugin to display dynamic label and grid lines.
   *
   */
  /* global Chartist */

  const defaultOptions = {
    shortMonth: [
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
    ],
    divisor: {
      '1D': 6,
      '1W': 5,
      '1M': 5,
      '3M': 3,
      '1Y': 6,
      '3Y': 3,
      '5Y': 5,
      '30Y': 5,
      Max: 5,
      custom: 2,
    },
    mobileDivisor: {
      '1D': 3,
      '1W': 4,
      '1M': 3,
      '3M': 3,
      '1Y': 3,
      '3Y': 3,
      '5Y': 3,
      '30Y': 3,
      Max: 3,
      custom: 2,
    },
  };

  (function (document, Chartist) {
    Chartist.plugins = Chartist.plugins || {};
    Chartist.plugins.dynamicXAxis = function (options) {
      options = Chartist.extend({}, defaultOptions, options);
      let compare; let
        temp = 0;
      let xAxisLabelsCount = 0;

      formatDate = (date, timespan, daysDifference, index) => {
        let formattedDate = new Date(date);
        let day = formattedDate.getDate();
        let month = formattedDate.getMonth() + 1;
        const year = formattedDate.getFullYear();
        let hours = formattedDate.getHours();
        const shortMonth = options.shortMonth[formattedDate.getMonth()];

        hours = hours < 10 ? `0${hours}` : hours;
        day = day < 10 ? `0${day}` : day;
        month = month < 10 ? `0${month}` : month;

        if (timespan === '1D') {
          formattedDate = `${hours}:00`;
        } else if (timespan === '1W') {
          formattedDate = `${day}.${month}.`;
        } else if (daysDifference <= 92) {
          formattedDate = `${day}. ${shortMonth}`;
        } else if (daysDifference <= 365) {
          if (!index) {
            formattedDate = `${year}`;
          } else {
            formattedDate = `${shortMonth}`;
          }
        } else if (daysDifference < 1800) {
          formattedDate = `${month}.${year}`;
        } else {
          formattedDate = `${year}`;
        }

        return formattedDate;
      };

      function getLabels(value, index, timespan, daysDifference) {
        if (value) {
          compare = timespan === '1D' ? new Date(value).getHours() : new Date(value).getDate();
          if (compare !== temp) {
            temp = compare;
            return formatDate(value, timespan, daysDifference, index);
          }
        }
        return null;
      }

      function get1WLabelsForMobile(value, index, timespan, daysDifference, divisor = 4) {
        if (value) {
          compare = new Date(value).getDate();
          if (compare !== temp) {
            temp = compare;
            xAxisLabelsCount += 1;
            if (xAxisLabelsCount <= divisor) {
              return formatDate(value, timespan, daysDifference, index);
            }
          }
        }
        return null;
      }

      return function dynamicXAxis(chart) {
        if (chart instanceof Chartist.Line || chart instanceof Chartist.Bar) {
          chart.on('updateXAxisLabelsCount', () => {
            xAxisLabelsCount = 0;
          });
          chart.on('zoomed', () => {
            const range = chart.options.axisX.highLow;
            const difference = range.high - range.low;
            const daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);
            let timespan = chart.options.timespan || '30Y';
            if (timespan !== '1D' && timespan !== '1W' && daysDifference <= 21) {
              timespan = 'custom';
            }

            Object.assign(chart.options.axisX, {
              divisor: chart.options.responsiveMode === 'mobile' ? options.mobileDivisor[timespan] : options.divisor[timespan],
              labelInterpolationFnc(value, index) {
                switch (timespan) {
                  case '1D':
                    return getLabels(value, index, timespan, daysDifference);
                  case '1W':
                    let x = 0;
                    if (
                      chart
                      && chart.data
                      && chart.data.series
                      && chart.data.series.length
                      && chart.data.series[0]
                      && chart.data.series[0].data
                      && chart.data.series[0].data[index]
                      && !Number.isNaN(chart.data.series[0].data[index].x)
                      && chart.data.series[0].data[index].x !== null
                    ) {
                      x = chart.data.series[0].data[index].x;
                    }
                    if (chart.options.responsiveMode === 'mobile') {
                      return get1WLabelsForMobile(
                        x,
                        index,
                        timespan,
                        daysDifference,
                        options.mobileDivisor[timespan],
                      );
                    }
                    return getLabels(x, index, timespan, daysDifference);

                  default:
                    return formatDate(value, timespan, daysDifference, index);
                }
              },
            });
          });
        }
      };
    };
  }(document, Chartist));

  return Chartist.plugins.dynamicXAxis;
}));
