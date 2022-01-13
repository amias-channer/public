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
        root['Chartist.plugins.colors'] = factory(Chartist);
    }
}(this, function (Chartist) {

    /**
     * Chartist.js plugin to display dynamic color lines.
     *
     */
    /* global Chartist */
    (function (Chartist) {

        Chartist.plugins = Chartist.plugins || {};
        Chartist.plugins.colors = function () {

            let i = 0;
            return function colors(chart) {
                if (chart instanceof Chartist.Line || chart instanceof Chartist.Bar) {
                    const colors = chart.data.series.map((set) => set.color);
                    chart.on('created', function () {
                        i = 0;
                    });
                    chart.on('draw', function (data) {
                        if (data.type === 'line') {
                            data.group.attr({
                                color: colors[i],
                            });
                            data.element.attr({
                                style: `stroke: ${colors[i]}`
                            });
                            i++;
                        }
                    });
                }
            };
        };

    }(Chartist));

    return Chartist.plugins.colors;

}));
