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
    root['Chartist.plugins.gridcolor'] = factory(Chartist);
  }
}(this, function (Chartist) {

  /**
   * Chartist.js plugin to display alternately grid background.
   *
   */
  /* global Chartist */
  (function (Chartist) {

    Chartist.plugins = Chartist.plugins || {};
    Chartist.plugins.gridcolor = function () {

      return function gridcolor(chart) {
        if (chart instanceof Chartist.Line || chart instanceof Chartist.Bar) {

          chart.on('created', (data) => {
            const grids = data.svg.querySelector('.ct-grids');
            const labels = data.svg.querySelector('.ct-labels');
            const { chartRect } = data;
            const boundries = {
              chartHeight: chart.svg.height(),
              chartWidth: chart.svg.width()
            }

            const steps = data.axisY.ticks.map((t) => data.axisY.projectValue(t));
            const stepLength = data.axisY.axisLength / (
              steps[0] < 0 ? steps.length : steps.length -1
            );
            let n = 0,
              even = true;

            labels.elem('rect', {
              x: chartRect.x2,
              y: chartRect.y2,
              width: boundries.chartWidth - chartRect.x2,
              height: boundries.chartHeight,
              fill: 'white'
            }, null, true);

            labels.elem('rect', {
              x: chartRect.x1,
              y: chartRect.y1,
              width: boundries.chartWidth,
              height: 35,
              fill: 'white'
            }, null, true);

            while (n < steps.length-1) {
              const css = even === true ? 'ct-grid-background-even' : 'ct-grid-background-odd';
              n += 1;
              even = !even;

              grids.elem('rect', {
                x: chartRect.x1,
                y: chartRect.y1 - steps[n],
                width: chartRect.width(),
                height: stepLength,
              }, css, true);
            }
          });
        }
      };
    };

  }(Chartist));

  return Chartist.plugins.gridcolor;

}));
