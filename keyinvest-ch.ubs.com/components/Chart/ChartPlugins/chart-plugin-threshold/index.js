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
      root['Chartist.plugins.threshold'] = factory(Chartist);
    }
  }(this, function (Chartist) {

  /**
   * Chartist.js plugin to display a specific timespan on chart.
   *
   */
  /* global Chartist */
  (function (document, Chartist) {

    var defaultOptions = {
        threshold: 0,
        classNames: {
            aboveThreshold: 'ct-threshold-above',
            belowThreshold: 'ct-threshold-below'
        },
        maskNames: {
            aboveThreshold: 'ct-threshold-mask-above',
            belowThreshold: 'ct-threshold-mask-below'
        }
    };

    function createMasks(data, options) {

        // Select the defs element within the chart or create a new one
        var defs = data.svg.querySelector('defs') || data.svg.elem('defs'),
            projectedThreshold = data.chartRect.height() - data.axisY.projectValue(options.threshold) + data.chartRect.y2,
            width = data.svg.width(),
            height = data.svg.height();

        // Create mask for upper part above threshold
        defs
            .elem('mask', {
                x: 0,
                y: 0,
                width: width,
                height: height,
                id: options.maskNames.aboveThreshold
            })
            .elem('rect', {
                x: 0,
                y: 0,
                width: width,
                height: projectedThreshold,
                fill: 'white'
            });

        // Create mask for lower part below threshold
        defs
            .elem('mask', {
                x: 0,
                y: 0,
                width: width,
                height: height,
                id: options.maskNames.belowThreshold
            })
            .elem('rect', {
                x: 0,
                y: projectedThreshold,
                width: width,
                height: height - projectedThreshold,
                fill: 'white'
            });

        return defs;
    }

    Chartist.plugins = Chartist.plugins || {};
    Chartist.plugins.ctThreshold = function(options) {

        options = Chartist.extend({}, defaultOptions, options);

        return function ctThreshold(chart) {
            if (chart instanceof Chartist.Line || chart instanceof Chartist.Bar) {
                chart.on('draw', function(data) {
                    if (data.type === 'point') {

                        // For points we can just use the data value and compare against the threshold in order to determine
                        // the appropriate class
                        data.element.addClass(
                            data.value.y >= chart.options.threshold ? options.classNames.aboveThreshold : options.classNames.belowThreshold
                        );
                    } else if (data.type === 'line' || data.type === 'bar' || data.type === 'area') {

                        // Bugfix for multiple charts using masks
                        var rand = Math.random().toString(36).substr(2, 16);
                        options.maskNames.aboveThreshold += rand;
                        options.maskNames.belowThreshold += rand;

                        // Cloning the original line path, mask it with the upper mask rect above the threshold and add the
                        // class for above threshold
                        data.element
                            .parent()
                            .elem(data.element._node.cloneNode(true))
                            .attr({
                                mask: 'url(#' + options.maskNames.aboveThreshold + ')'
                            })
                            .addClass(options.classNames.aboveThreshold);

                        // Use the original line path, mask it with the lower mask rect below the threshold and add the class
                        // for blow threshold
                        data.element
                            .attr({
                                mask: 'url(#' + options.maskNames.belowThreshold + ')'
                            })
                            .addClass(options.classNames.belowThreshold);
                    }
                });

                // On the created event, create the two mask definitions used to mask the line graphs
                chart.on('created', function(data) {
                    options.threshold = chart.options.threshold;
                    createMasks(data, options);
                });
            }
        };
    };
}(document, Chartist));

return Chartist.plugins.threshold;

}));
