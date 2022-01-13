import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { path } from 'ramda';
import { Button } from 'reactstrap';
import './MyMarketIndicatorTileWithChart.scss';
import {
  PUSHABLE_DISPLAY_MODE,
} from '../../../../PushManager/PushableDefault/PushableDefault.helper';
import PushableDefault from '../../../../PushManager/PushableDefault';
import PushableChangePercent from '../../../../PushManager/PushableChangePercent';
import AsyncChart from '../../../../Chart/AsyncChart';
import { TIMESPAN_1D } from '../../../../Chart/Chart.helper';
import TrendPeriod
  from '../../../../Market/MarketRealTimeIndications/TrendPeriod';
import Icon from '../../../../Icon';
import i18n from '../../../../../utils/i18n';

export const MY_MARKET_INDICATOR_TILE_CHART_OPTIONS = {
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

export class MyMarketIndicatorTileWithChartComponent extends React.PureComponent {
  constructor(props) {
    super(props);
    this.onClickHandler = this.onClickHandler.bind(this);
    this.onRemoveHandler = this.onRemoveHandler.bind(this);
  }

  onClickHandler() {
    const { selectInstrument, field } = this.props;
    selectInstrument(field);
  }

  onRemoveHandler(e) {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
    const { removeInstrumentFunc, field } = this.props;
    removeInstrumentFunc(field);
  }

  render() {
    const { className, field, isLoading } = this.props;
    return (
      <PushableDefault
        displayMode={PUSHABLE_DISPLAY_MODE.COLOR_BAR}
        field={field}
        className={classNames('IndicatorTile', 'MarketIndicatorTile', 'MyMarketIndicatorTileWithChart', className)}
      >
        <div
          className="inner-wrapper color-bar"
          onClick={this.onClickHandler}
          onKeyDown={this.onClickHandler}
          role="button"
          tabIndex="0"
        >
          <div className="row">
            <div className="col-11 name">{field.name}</div>
            <div className="col-1 action">
              {!isLoading && (
                <Button
                  className="m-0 p-0 button-delete"
                  color="outline"
                  onClick={this.onRemoveHandler}
                  title={i18n.t('delete')}
                >
                  <Icon type="trash" />
                </Button>
              )}
            </div>
          </div>
          <div className="row">
            <div className="col-7">
              <div className="mini-chart-container">
                <AsyncChart
                  className="mini-chart d-block"
                  uniqKey={`MarketTileChart-${TIMESPAN_1D}-sin=${field.sin}`}
                  url={path([`chartUrl_${TIMESPAN_1D}`], field)}
                  timespan={TIMESPAN_1D}
                  options={MY_MARKET_INDICATOR_TILE_CHART_OPTIONS}
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

MyMarketIndicatorTileWithChartComponent.propTypes = {
  className: PropTypes.string,
  field: PropTypes.objectOf(PropTypes.any),
  selectInstrument: PropTypes.func,
  removeInstrumentFunc: PropTypes.func,
  isLoading: PropTypes.bool,
};

MyMarketIndicatorTileWithChartComponent.defaultProps = {
  className: 'col-lg-2',
  field: {},
  selectInstrument: () => {},
  removeInstrumentFunc: () => {},
  isLoading: false,
};

const MyMarketIndicatorTileWithChart = MyMarketIndicatorTileWithChartComponent;
export default MyMarketIndicatorTileWithChart;
