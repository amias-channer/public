import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Row } from 'reactstrap';
import { connect } from 'react-redux';
import MarketIndicatorTile from './MarketIndicatorTile';
import {
  marketGenericFetchContent,
} from '../MarketGenericLayout/actions';
import { MARKET_INSTRUMENT_IDENTIFIER } from '../MarketGenericLayout/MarketGenericLayout.helper';
import {
  NETCENTRIC_CTA_TYPE_LINK,
  dispatchAnalyticsClickTrack,
} from '../../../analytics/Analytics.helper';
import MarketIndicatorTileWithChart from './MarketIndicatorTileWithChart';

export const MARKET_INDICATIONS_DISPLAY_MODE = {
  DEFAULT: null,
  WITH_CHART: 'MarketIndicatorTileWithChart',
};

export class MarketRealTimeIndicationsComponent extends React.PureComponent {
  constructor(props) {
    super(props);
    this.onSelectInstrument = this.onSelectInstrument.bind(this);
  }

  onSelectInstrument(id, name) {
    const { dispatch, marketPageStateName } = this.props;
    dispatch(marketGenericFetchContent({
      [MARKET_INSTRUMENT_IDENTIFIER]: id,
      name,
    }, marketPageStateName));

    dispatchAnalyticsClickTrack(
      name,
      id,
      NETCENTRIC_CTA_TYPE_LINK,
      'Market Indicator',
    );
  }

  render() {
    const {
      tiles, activeInstrument, className, displayMode,
    } = this.props;
    let MarketIndicatorComponent = MarketIndicatorTile;
    if (displayMode === MARKET_INDICATIONS_DISPLAY_MODE.WITH_CHART) {
      MarketIndicatorComponent = MarketIndicatorTileWithChart;
    }
    const tilesComponents = tiles.map((field) => (
      <MarketIndicatorComponent
        key={field[MARKET_INSTRUMENT_IDENTIFIER]}
        className={`col-auto ${activeInstrument[MARKET_INSTRUMENT_IDENTIFIER] === field[MARKET_INSTRUMENT_IDENTIFIER] ? 'active' : ''}`}
        field={field}
        selectInstrument={this.onSelectInstrument}
      />
    ));
    return (
      <div className={classNames('RealTimeIndications', 'MarketRealTimeIndications', className)}>
        <Row className="justify-content-center justify-content-md-start">
          {tilesComponents.length > 0 && tilesComponents }
        </Row>
      </div>
    );
  }
}

MarketRealTimeIndicationsComponent.propTypes = {
  tiles: PropTypes.arrayOf(PropTypes.any),
  activeInstrument: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.func,
  className: PropTypes.string,
  marketPageStateName: PropTypes.string,
  displayMode: PropTypes.string,
};

MarketRealTimeIndicationsComponent.defaultProps = {
  displayMode: null,
  tiles: [],
  activeInstrument: {},
  dispatch: null,
  className: '',
  marketPageStateName: '',
};
const MarketRealTimeIndications = connect()(MarketRealTimeIndicationsComponent);
export default MarketRealTimeIndications;
