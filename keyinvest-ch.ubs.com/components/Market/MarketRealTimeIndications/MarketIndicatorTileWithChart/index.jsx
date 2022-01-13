import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './MarketIndicatorTileWithChart.scss';
import {
  PUSHABLE_DISPLAY_MODE,
} from '../../../PushManager/PushableDefault/PushableDefault.helper';
import PushableDefault from '../../../PushManager/PushableDefault';
import PushableChangePercent from '../../../PushManager/PushableChangePercent';
import TrendPeriod from '../TrendPeriod';
import { MARKET_INSTRUMENT_IDENTIFIER } from '../../MarketGenericLayout/MarketGenericLayout.helper';
import AsyncChart from '../../../Chart/AsyncChart';
import { TIMESPAN_1D } from '../../../Chart/Chart.helper';
import { adformTrackEventClick } from '../../../../adformTracking/AdformTracking.helper';
import AdformTrackingVars from '../../../../adformTracking/AdformTrackingVars';
import { INSTRUMENT_IDENTIFIER_ISIN } from '../../../../utils/globals';

export const MARKET_INDICATOR_TILE_CHART_OPTIONS = {
  hideGridColor: true,
  showTimespans: false,
  showScrollbar: false,
  showTooltip: false,
  greenRedPushableChart: true,
  showPlaceholder: false,
  defaultTimespan: TIMESPAN_1D,
  height: 37,
  axisX: {
    offset: 0,
    showLabel: false,
    showGrid: false,
    labelOffset: { x: 0, y: 0 },
  },
  axisY: {
    offset: 0,
    showLabel: false,
    showGrid: false,
    labelOffset: { x: 0, y: 0 },
  },
  chartPadding: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
};

export class MarketIndicatorTileWithChartComponent extends React.PureComponent {
  constructor(props) {
    super(props);
    this.onClickHandler = this.onClickHandler.bind(this);
  }

  onClickHandler(event) {
    const { selectInstrument, field } = this.props;
    const isin = field[INSTRUMENT_IDENTIFIER_ISIN];
    adformTrackEventClick(event, 'markets-overview-chart-click', new AdformTrackingVars().setIsin(isin));
    selectInstrument(field[MARKET_INSTRUMENT_IDENTIFIER], field.name);
  }

  render() {
    const { className, field } = this.props;
    return (
      <PushableDefault
        displayMode={PUSHABLE_DISPLAY_MODE.COLOR_BAR}
        field={field}
        className={classNames('IndicatorTile', 'MarketIndicatorTile', 'MarketIndicatorTileWithChart', className)}
      >
        <div
          className="inner-wrapper color-bar"
          onClick={this.onClickHandler}
          onKeyDown={this.onClickHandler}
          role="button"
          tabIndex="0"
        >
          <div className="name">{field.name}</div>
          <div className="row">
            <div className="col-7">
              <div className="mini-chart-container">
                <AsyncChart
                  className="mini-chart d-block"
                  uniqKey={`MarketTileChart-${TIMESPAN_1D}-sin=${field[MARKET_INSTRUMENT_IDENTIFIER]}`}
                  url={`/product/chart/index?timespan=${TIMESPAN_1D}&sin=${field[MARKET_INSTRUMENT_IDENTIFIER]}`}
                  timespan={TIMESPAN_1D}
                  options={MARKET_INDICATOR_TILE_CHART_OPTIONS}
                />
              </div>
            </div>
            <div className="col-5">
              <div className="pushable-val"><PushableDefault field={field} /></div>
              <PushableChangePercent field={field} />
            </div>
          </div>
          <TrendPeriod field={field} />
        </div>
      </PushableDefault>
    );
  }
}

MarketIndicatorTileWithChartComponent.propTypes = {
  className: PropTypes.string,
  field: PropTypes.objectOf(PropTypes.any),
  selectInstrument: PropTypes.func,
};

MarketIndicatorTileWithChartComponent.defaultProps = {
  className: 'col-lg-2',
  field: {},
  selectInstrument: () => {},
};

const MarketIndicatorTileWithChart = MarketIndicatorTileWithChartComponent;
export default MarketIndicatorTileWithChart;
