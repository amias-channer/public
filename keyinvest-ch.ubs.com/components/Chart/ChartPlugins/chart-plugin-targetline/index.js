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
    root['Chartist.plugins.targetline'] = factory(Chartist);
  }
}(this, (Chartist) => {
  /**
   * Chartist.js plugin to display target lines with labels within the chart grid.
   *
   */
  /* global Chartist */
  (function (document, Chartist) {
    Chartist.plugins = Chartist.plugins || {};
    Chartist.plugins.targetline = function (targetLines) {
      function addLabel(target, positions, grids) {
        const className = `ct-targetline-label ${target.align}`;
        grids.elem('text', {
          x: positions.label.x,
          y: positions.label.y,
        }, className).text(target.label);
      }

      function getStartPositionFromTargetLabel(target) {
        const spacePerChar = 6;
        if (target
          && target.label
        ) {
          return target.label.length * spacePerChar;
        }
        // Default label size
        return 100;
      }

      function addTargetRect(data, grids, target) {
        if (!target.value || !target.toValue) return;
        let position; let positions; let
          height;
        target.value = target.value === 'max' ? data.axisY.options.high : target.value;
        target.toValue = target.toValue === 'min' ? data.axisY.options.low : target.toValue;
        position = data.chartRect.height() - data.axisY.projectValue(target.value);
        height = data.chartRect.height() - data.axisY.projectValue(target.toValue) - position;
        positions = {
          x: data.chartRect.x1,
          y: position,
          width: data.chartRect.x2,
          height,
          label: {
            x: data.chartRect.x2 - target.labelOffset.x,
            y: position + height / 2 - target.labelOffset.y,
          },
        };
        grids.elem('rect', positions, `ct-targetline-rect ${target.id}`, true);

        addLabel(target, positions, grids);
      }

      function calcPositions(data, target) {
        let position; let
          positions;
        if (target.align === 'vertical') {
          position = data.axisX.projectValue(target.value);

          // eslint-disable-next-line max-len
          let labelXPosition = position - (target.labelOffset.x + getStartPositionFromTargetLabel(target) - 5);
          if (labelXPosition < 0) {
            labelXPosition = position - (target.labelOffset.x - 5);
          }

          positions = {
            x1: position,
            x2: position,
            y1: data.chartRect.y1,
            y2: data.chartRect.y2,
            label: {
              x: labelXPosition,
              y: data.chartRect.y1 - target.labelOffset.y,
            },
          };
        } else {
          position = data.chartRect.height() - data.axisY.projectValue(target.value);
          positions = {
            x1: !target.hideLabel ? getStartPositionFromTargetLabel(target) : data.chartRect.x1,
            x2: data.chartRect.x2 - target.labelOffset.x,
            y1: position,
            y2: position,
            label: {
              x: 5, // data.chartRect.x2 - (target.labelOffset.x - 5),
              y: position - target.labelOffset.y,
            },
          };
        }
        return positions;
      }

      function addTargetLine(data, grids, target) {
        if (!target.value) return;
        target.align = target.align || 'horizontal';
        target.labelOffset = target.labelOffset || data.options.targetLines.labelOffset;
        const positions = calcPositions(data, target);

        if (target.align === 'rect') {
          addTargetRect(data, grids, target);
          return;
        }

        grids.elem('line', positions, `ct-targetline ${target.align} ${target.id}`);

        if (!target.hideLabel) {
          addLabel(target, positions, grids);
        }
      }

      return function targetline(chart) {
        if (chart instanceof Chartist.Line || chart instanceof Chartist.Bar) {
          let instance;

          function updateVisibility(dataSets) {
            const chartMode = dataSets.length > 1 ? 'rel' : 'abs';
            targetLines.forEach((line) => {
              if (chartMode === 'rel'
                && line.id !== 'fixingDate'
                && line.id !== 'barrierLevelRelativePercent') {
                line.visible = false;
                return;
              } if (
                chartMode === 'abs'
                  && line.id.indexOf(dataSets[0].sin) === -1
                  && line.id.indexOf('deri') === -1
                  && line.id.indexOf('previous-close') === -1
              ) {
                line.visible = false;
                return;
              }
              line.visible = true;
            });
          }

          function updateDrawTargetLines() {
            const dataSets = chart.data.series.filter((set) => set.visible);
            if (!targetLines || !dataSets.length) return;
            updateVisibility(dataSets);
            const grids = chart.svg.querySelector('.ct-grids');

            try {
              // Merge line with the value into 1 line
              let index = targetLines.length - 1;
              while (index >= 0) {
                const line = targetLines[index];

                if (!line.visible) {
                  targetLines.splice(index, 1);
                  break;
                }

                if (targetLines[index + 1]
                  && targetLines[index + 1].value === line.value
                ) {
                  line.label += ` / ${targetLines[index + 1].label}`;
                  line.labelOffset = targetLines[index + 1].labelOffset || instance.options.targetLines.labelOffset;
                  // line.labelOffset.x = 80;
                  targetLines.splice(index + 1, 1);
                }
                index -= 1;
              }
            } catch (e) {
              console.log(e);
            }
            // Drawing the prepared lines
            targetLines.forEach((line) => {
              addTargetLine(instance, grids, line);
            });
          }

          function updateData() {
            const dataSets = chart.data.series.filter((set) => set.visible);
            if (!targetLines || !dataSets.length) return;
            updateVisibility(dataSets);
          }

          chart.on('created', (data) => {
            instance = data;
            updateDrawTargetLines();
          });

          chart.on('updateTargetLines', () => {
            updateData();
          });
        }
      };
    };
  }(document, Chartist));

  return Chartist.plugins.targetline;
}));
