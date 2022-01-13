import React from 'react';
import { Row, Col } from 'reactstrap';
import classNames from 'classnames';
import './DeriRiskIndicatorTile.scss';
import PropTypes from 'prop-types';
import {
  getCurrentStateWidgetLabel,
  getCurrentStateWidgetValue,
  getMarketSentimentSmallValue, getMarketSentimentSymbolByValue,
  getNameShortValue,
  getSinValue,
  getTimeFrameWidgetValue,
  getTypeValue,
  getUpdateWidgetLabel,
  getUpdateWidgetValue,
} from '../DeriRiskIndicator.helper';

function DeriRiskIndicatorTile(props) {
  const {
    data, onTileClick, isActive, className, tileName,
  } = props;
  const onTileClicked = () => {
    onTileClick(getSinValue(data), tileName);
  };
  const marketSentimentValue = getMarketSentimentSmallValue(data);
  return (
    <div role="presentation" className={classNames('DeriRiskIndicatorTile', className, isActive ? 'active' : '')} onClick={onTileClicked}>
      <div className="wrapper">
        <Row>
          <Col className="col-auto">
            <h2>
              {getNameShortValue(data)}
              {' '}
              {getTypeValue(data)}
              {' '}
            </h2>
          </Col>
          <Col className="col-auto ml-auto">
            <div className={getMarketSentimentSymbolByValue(marketSentimentValue)} />
          </Col>
        </Row>
        <Row>
          <Col className="col-6 col-lg-6 col-md-12">
            <h5>
              <span className={classNames('indicator-text', marketSentimentValue)}>{marketSentimentValue}</span>
              {` ${getTimeFrameWidgetValue(data)} ${getCurrentStateWidgetLabel(data)} `}
              <span className={classNames('indicator-text', marketSentimentValue)}>{getCurrentStateWidgetValue(data)}</span>
            </h5>
          </Col>
        </Row>
        <Row>
          <Col>
            <span className="last-update">
              {`${getUpdateWidgetLabel(data)}: ${getUpdateWidgetValue(data)}`}
            </span>
          </Col>
        </Row>
      </div>
    </div>
  );
}

DeriRiskIndicatorTile.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  onTileClick: PropTypes.func,
  isActive: PropTypes.bool,
  className: PropTypes.string,
  tileName: PropTypes.string,
};

DeriRiskIndicatorTile.defaultProps = {
  data: {
    nameShort: {},
    type: {},
  },
  isActive: false,
  onTileClick: () => {},
  className: '',
  tileName: '',
};

export default DeriRiskIndicatorTile;
