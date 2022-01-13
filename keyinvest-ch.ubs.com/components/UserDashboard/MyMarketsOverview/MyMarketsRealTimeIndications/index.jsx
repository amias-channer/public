import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Row } from 'reactstrap';
import { connect } from 'react-redux';
import {
  myMarketsDeleteUnderlying,
  myMarketsSetActiveUnderlying,
} from '../actions';
import MyMarketIndicatorTileWithChart
  from './MyMarketIndicatorTileWithChart';
import { MY_MARKET_INSTRUMENT_IDENTIFIER } from '../MyMarketsOverview.helper';

export const MARKET_INDICATIONS_DISPLAY_MODE = {
  DEFAULT: null,
  WITH_CHART: 'MarketIndicatorTileWithChart',
};

export class MyMarketsRealTimeIndicationsComponent extends React.PureComponent {
  constructor(props) {
    super(props);
    this.onSelectInstrument = this.onSelectInstrument.bind(this);
    this.onDeleteInstrument = this.onDeleteInstrument.bind(this);
  }

  onSelectInstrument(underlyingData) {
    const { dispatch } = this.props;
    dispatch(myMarketsSetActiveUnderlying(underlyingData));
  }

  onDeleteInstrument(underlyingData) {
    const { dispatch } = this.props;
    dispatch(myMarketsDeleteUnderlying(underlyingData));
  }

  render() {
    const {
      tiles, activeInstrument, className, isLoading,
    } = this.props;
    const tilesComponents = tiles.map((field) => (
      <MyMarketIndicatorTileWithChart
        key={field[MY_MARKET_INSTRUMENT_IDENTIFIER]}
        className={`col-auto ${activeInstrument[MY_MARKET_INSTRUMENT_IDENTIFIER] === field[MY_MARKET_INSTRUMENT_IDENTIFIER] ? 'active' : ''}`}
        field={field}
        selectInstrument={this.onSelectInstrument}
        removeInstrumentFunc={this.onDeleteInstrument}
        isLoading={isLoading}
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

MyMarketsRealTimeIndicationsComponent.propTypes = {
  tiles: PropTypes.arrayOf(PropTypes.any),
  activeInstrument: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.func,
  isLoading: PropTypes.bool,
  className: PropTypes.string,
};

MyMarketsRealTimeIndicationsComponent.defaultProps = {
  tiles: [],
  activeInstrument: {},
  dispatch: null,
  isLoading: false,
  className: '',
};
const MyMarketsRealTimeIndications = connect()(MyMarketsRealTimeIndicationsComponent);
export default MyMarketsRealTimeIndications;
