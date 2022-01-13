import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Chartist from 'chartist';
import { Slider, Handles, Tracks } from 'react-compound-slider';
import { getScrollbarOptions, setZoom } from '../Chart.helper';
import { Handle, Track } from './components';

class ChartistScrollbar extends Component {
  constructor(props) {
    super(props);
    this.onSlideEndHandler = this.onSlideEndHandler.bind(this);
    this.onZoomEvent = this.onZoomEvent.bind(this);
    this.state = {
      values: [0, 100],
      domain: [0, 100],
    };
  }

  componentDidMount() {
    if (!this.scrollbarChart) {
      this.createChart(this.props);
      setTimeout(() => {
        window.removeEventListener('resize', this.scrollbarChart.resizeListener);
      }, 100);
    }
  }

  componentWillUnmount() {
    if (this.scrollbarChart) {
      this.scrollbarChart.detach();
    }
  }

  onZoomEvent(values) {
    this.setState({
      values: [values[0], values[1]],
    });
  }

  onSlideEndHandler(values) {
    const { chart } = this.props;
    setZoom(chart, values);
  }

  createChart(config) {
    const { chart, options } = this.props;
    const zoomFunc = this.onZoomEvent;
    const chartData = {
      series: config.data.series.filter((set, index) => !index),
    };
    this.scrollbarChart = new Chartist.Line('.ct-scrollbar-chart', chartData, getScrollbarOptions());
    this.scrollbarChart.on('created', () => {
      const dataLength = chartData.series[0].data.length - 1;
      this.setState({
        values: [options.axisX.lowIndex, dataLength],
        domain: [0, dataLength],
      });
    });
    if (chart && chart.on) {
      chart.on('zoomed', (data) => {
        if (data.type === 'scrollbar') return;
        zoomFunc([data.axisX.rangeIndex.low, data.axisX.rangeIndex.high]);
      });
    }
  }

  render() {
    const { values, domain } = this.state;
    return (
      <div className="ct-scrollbar">
        <div className="ct-scrollbar-chart" />
        <Slider
          domain={[domain[0], domain[1]]}
          step={1}
          mode={2}
          values={[values[0], values[1]]}
          onSlideEnd={this.onSlideEndHandler}
        >
          <Tracks left={false} right={false}>
            {({ tracks, getTrackProps }) => (
              <div className="ct-scrollbar-tracks">
                {tracks.map(({ id, source, target }) => (
                  <Track
                    key={id}
                    source={source}
                    target={target}
                    getTrackProps={getTrackProps}
                  />
                ))}
              </div>
            )}
          </Tracks>
          <Handles>
            {({ handles, getHandleProps }) => (
              <div className="ct-scrollbar-handles">
                {handles.map((handle) => (
                  <Handle
                    key={handle.id}
                    handle={handle}
                    getHandleProps={getHandleProps}
                  />
                ))}
              </div>
            )}
          </Handles>
        </Slider>
      </div>
    );
  }
}

ChartistScrollbar.propTypes = {
  chart: PropTypes.objectOf(PropTypes.any),
  options: PropTypes.objectOf(PropTypes.any),
};

ChartistScrollbar.defaultProps = {
  chart: {},
  options: {},
};

export default ChartistScrollbar;
