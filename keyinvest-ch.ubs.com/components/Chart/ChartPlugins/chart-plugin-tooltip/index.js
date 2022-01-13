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
    root['Chartist.plugins.tooltip'] = factory(Chartist);
  }
}(this, (Chartist) => {
  /**
   * Chartist.js plugin to display alternately grid background.
   *
   */
  /* global Chartist */
  (function (Chartist) {
    Chartist.plugins = Chartist.plugins || {};
    Chartist.plugins.tooltip = function (targets) {
      const formatDate = (date, timespan) => {
        let formattedDate = new Date(Number(date));
        let day = formattedDate.getDate();
        let month = formattedDate.getMonth() + 1;
        let hours = formattedDate.getHours();
        let minutes = formattedDate.getMinutes();
        seconds = formattedDate.getSeconds();
        const year = formattedDate.getFullYear();

        hours = hours < 10 ? `0${hours}` : hours;
        minutes = minutes < 10 ? `0${minutes}` : minutes;
        seconds = seconds < 10 ? `0${seconds}` : seconds;
        day = day < 10 ? `0${day}` : day;
        month = month < 10 ? `0${month}` : month;

        if (timespan === '1D') {
          formattedDate = `${hours}:${minutes}:${seconds}`;
        } else if (timespan === '1W') {
          formattedDate = `${day}.${month} ${hours}:${minutes}:${seconds}`;
        } else {
          formattedDate = `${day}.${month}.${year}`;
        }
        return formattedDate;
      };

      const closestMatch = (arr, goal) => {
        if (arr && arr.length > 0) {
          const match = arr.reduce((prev, curr) => (
            Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev
          ));
          return match || null;
        }
        return null;
      };

      return function tooltip(chart) {
        if (chart instanceof Chartist.Line || chart instanceof Chartist.Bar) {
          chart.on('created', (data) => {
            const chartGrid = chart.container.querySelector('.ct-grids');
            const series = chart.container.querySelectorAll('.ct-series');
            const pointsIndex = [];
            const decimalDigits = chart.rawData && typeof chart.rawData.dig !== 'undefined' ? chart.rawData.dig : 2;

            series.forEach((set) => {
              const points = set.querySelectorAll('.ct-point');
              let prevIndex = 0;
              if (!points.length) return;
              points.forEach((point) => {
                const indexX = Math.round(point.getAttribute('x1'));
                if (prevIndex !== indexX) {
                  point.setAttribute('ct-index-x', indexX);
                  prevIndex = indexX;
                  pointsIndex.push(indexX);
                }
              });
            });

            chart.container.style.position = 'relative';

            let tooltip = chart.container.querySelector('.ct-tooltip') || null;
            tooltip = tooltip || document.createElement('div');
            tooltip.classList.add('ct-tooltip');
            chart.container.appendChild(tooltip);

            chartGrid.addEventListener('mouseenter', () => {
              tooltip.style.display = 'block';
            });
            chart.container.addEventListener('mouseleave', () => {
              tooltip.style.display = 'none';
            });

            chartGrid.addEventListener('mousemove', (event) => {
              const mouseX = event.offsetX;
              let firstEntry = false;
              if (!mouseX) return;

              const match = closestMatch(pointsIndex, mouseX.toString());
              if (match !== undefined && match !== null) {
                const matchPoint = chart.container.querySelector(`[ct-index-x="${match}"]`);
                let tooltipX = matchPoint.getAttribute('x1');
                const tooltipY = matchPoint.getAttribute('y1');

                const points = chart.container.querySelectorAll(`[ct-index-x="${match}"]`);
                if (points.length) {
                  tooltip.innerHTML = '';
                  points.forEach((point) => {
                    if (!point.parentNode) return;
                    const classList = point.parentNode.getAttribute('class').split(' ');
                    if (classList[2]) return;
                    const seriesCss = classList[1];
                    const color = point.parentNode.getAttribute('color');
                    const meta = point.getAttribute('ct:meta') || null;
                    const values = point.getAttribute('ct:value').split(',') || null;
                    const value = meta || (values && Array.isArray(values) ? values[1] || 0 : 0);
                    if (!firstEntry) {
                      tooltip.innerHTML += formatDate(
                        (values && Array.isArray(values) ? values[0] || 0 : 0),
                        data.options.timespan,
                      );
                    }
                    tooltip.innerHTML += `</br><i class="bullet" style="background: ${color}"></i><span class="${seriesCss}">${Number(value).toFixed(decimalDigits)}</span>`;
                    firstEntry = true;
                  });
                }

                if (tooltipX > data.chartRect.width() / 2) {
                  tooltip.classList.add('reverse');
                  tooltipX -= tooltip.offsetWidth - 20;
                } else {
                  tooltip.classList.remove('reverse');
                }

                tooltip.style.left = `${tooltipX - 10}px`;
                tooltip.style.top = `${tooltipY - tooltip.offsetHeight - 9}px`;
              }
            });
          });
        }
      };
    };
  }(Chartist));

  return Chartist.plugins.tooltip;
}));
