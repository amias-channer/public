import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';
import MediaQuery from 'react-responsive';
import Swiper from 'react-id-swiper';
import 'swiper/swiper.scss';

import { pathOr } from 'ramda';
import {
  volatilityMonitorFetchContent,
  volatilityMonitorSetActiveChartSin, volatilityMonitorSetActiveChartTimespan,
  volatilityMonitorWillUnmount,
} from './actions';
import VolatilityMonitorTile from './VolatilityMonitorTile';
import AsyncChart from '../../Chart/AsyncChart';
import { generateUniqId } from '../../../utils/utils';
import './VolatilityMonitor.scss';
import mediaQueries from '../../../utils/mediaQueries';
import {
  getActiveChartTimespanKey,
  getVolatilityTileData,
  getVolatilityTileIsActive, getVolatilityTileName, getVolatilityTileSin,
} from './VolatilityMonitor.helper';
import {
  DEFAULT_CHART_TIMESPAN, TIMESPAN_1D,
  TIMESPAN_1M, TIMESPAN_1W, TIMESPAN_1Y,
  TIMESPAN_3M, TIMESPAN_5Y,
  TIMESPAN_MAX,
} from '../../Chart/Chart.helper';
import {
  dispatchAnalyticsClickTrack,
  NETCENTRIC_CTA_TYPE_HTML_TEXT,
} from '../../../analytics/Analytics.helper';

export class VolatilityMonitorComponent extends React.Component {
  constructor(props) {
    super(props);
    const { dispatch } = props;
    this.onVolatilityTileClick = this.onVolatilityTileClick.bind(this);
    this.toggleChartTimespan = this.toggleChartTimespan.bind(this);
    dispatch(volatilityMonitorFetchContent());
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(volatilityMonitorWillUnmount());
  }

  onVolatilityTileClick(sin) {
    const { dispatch, data, pageTitle } = this.props;
    if (data.activeChartSin === sin) {
      return;
    }
    dispatchAnalyticsClickTrack(
      getVolatilityTileName(sin, data),
      window.location.pathname,
      NETCENTRIC_CTA_TYPE_HTML_TEXT,
      pageTitle,
    );
    dispatch(volatilityMonitorSetActiveChartSin(sin));
  }

  getVolatilityMonitorTiles(data) {
    const sortedTilesSins = this.sortVolatilityMonitorTiles(data);
    return sortedTilesSins.map(
      (item) => this.getVolatilityMonitorTile(item, data),
    );
  }

  getVolatilityMonitorTile(item, data) {
    return (
      <Col md="6" key={getVolatilityTileSin(item, data)}>
        <VolatilityMonitorTile
          data={getVolatilityTileData(item, data)}
          onClick={this.onVolatilityTileClick}
          isActive={getVolatilityTileIsActive(item, data)}
        />
      </Col>
    );
  }

  // eslint-disable-next-line class-methods-use-this
  sortVolatilityMonitorTiles(data) {
    let keys = [];
    if (data.widgetsData) {
      keys = Object.keys(data.widgetsData);
      const [first, last] = keys;
      if (data.widgetsData[first]
          && data.widgetsData[last]
        && data.widgetsData[first].order
        && data.widgetsData[last].order) {
        keys = [];
        if (data.widgetsData[first].order < data.widgetsData[last].order) {
          keys.push(first, last);
        } else {
          keys.push(last, first);
        }
      }
    }
    return keys;
  }

  toggleChartTimespan(timespan) {
    const { dispatch } = this.props;
    dispatch(volatilityMonitorSetActiveChartTimespan(timespan));
  }

  render() {
    const { data, isLoading } = this.props;
    const chartOptions = {
      showTimespans: true,
      showScrollbar: true,
      timespans: [
        TIMESPAN_1D, TIMESPAN_1W, TIMESPAN_1M,
        TIMESPAN_3M, TIMESPAN_1Y, TIMESPAN_5Y, TIMESPAN_MAX,
      ],
      defaultTimespan: DEFAULT_CHART_TIMESPAN,
    };
    if (data && Object.keys(data).length > 0) {
      return (
        <div className="VolatilityMonitor col-lg">
          <>
            <MediaQuery query={mediaQueries.tablet}>
              <Row>
                {this.getVolatilityMonitorTiles(data)}
              </Row>
            </MediaQuery>

            <MediaQuery query={mediaQueries.mobileOnly}>
              <Swiper slidesPerView="auto" spaceBetween={0}>
                {this.getVolatilityMonitorTiles(data)}
              </Swiper>
            </MediaQuery>

            {data.chartUrls && (
            <Row>
              <Col>
                <AsyncChart
                  uniqKey={data.activeChartSin}
                  url={data.chartUrls[data.activeChartSin][
                    getActiveChartTimespanKey(data.activeChartTimespan)
                  ]}
                  options={chartOptions}
                  toggleChartTimespan={this.toggleChartTimespan}
                  timespan={data.activeChartTimespan}
                />
              </Col>
            </Row>
            )}

            <Row>
              <h2>
                {data.widgetsData
              && data.activeChartSin
              && data.widgetsData[data.activeChartSin]
              && data.widgetsData[data.activeChartSin].name.value}
              </h2>
              {data.activeChartSin
              && data.descriptionRows[data.activeChartSin]
              && data.descriptionRows[data.activeChartSin].map((item) => (
                <p key={generateUniqId()}>{item}</p>))}
            </Row>
          </>
        </div>
      );
    }
    return (
      <div className="VolatilityMonitor col-lg">
        {isLoading && (
          <div className="mt-5 is-loading" />
        )}
      </div>
    );
  }
}

VolatilityMonitorComponent.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  isLoading: PropTypes.bool,
  dispatch: PropTypes.func,
  pageTitle: PropTypes.string,
};

VolatilityMonitorComponent.defaultProps = {
  data: {
    widgetsData: {},
    headerData: {},
    descriptionRows: [],
    activeChartSin: '',
    chartUrls: [],
  },
  isLoading: false,
  pageTitle: '',

  dispatch: () => {},
};

function mapStateToProps(state) {
  return {
    data: state.volatilityMonitor.data,
    isLoading: state.volatilityMonitor.isLoading,
    pageTitle: pathOr('', ['global', 'navigationItemData', 'pageTitle'], state),
  };
}
const VolatilityMonitor = connect(mapStateToProps)(VolatilityMonitorComponent);
export default VolatilityMonitor;
