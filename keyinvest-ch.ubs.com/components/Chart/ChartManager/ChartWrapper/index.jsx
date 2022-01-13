import React from 'react';
import { connect } from 'react-redux';
import produce from 'immer';
import { pathOr } from 'ramda';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ErrorBoundary from '../../../ErrorBoundary';
import UncontrolledChartComponent from './UncontrolledChart';
import { generateUniqId, isEmptyData } from '../../../../utils/utils';
import ChartTimespan from '../../ChartTimespan';
import {
  getChartInstance,
  getChartScrollBarSettings,
  getChartDataSets,
  getPushableChartUpdaterFieldFromDataSet,
} from '../ChartManager.helper';
import ChartistScrollbar from '../../ChartistScrollbar';
import PushableChartUpdater from '../../../PushManager/PushableChartUpdater';
import i18n from '../../../../utils/i18n';
import './Chart.scss';
import ChartLoading from '../../ChartLoading';
import ChartPlaceholder from '../../ChartPlaceholder';
import { DESKTOP_MODE } from '../../../../utils/responsive';

export class ChartWrapper extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentPushClass: null,
    };
    this.receivePushResultData = this.receivePushResultData.bind(this);
  }

  getChartInstance() {
    const { uniqId } = this.props;
    return getChartInstance(uniqId);
  }

  receivePushResultData(pushResultData, chartIndex) {
    if (pushResultData) {
      this.setState(produce((draft) => {
        draft.currentPushClass = `${pushResultData.class} ${pushResultData.class}-${chartIndex}`;
      }));
    }
  }

  render() {
    const {
      data, isReady, className, options, uniqId, children,
      toggleChartTimespan, timespan, type, responsiveMode,
    } = this.props;
    const { currentPushClass } = this.state;
    const { showTimespans, showScrollbar } = options;
    const enableScrollBar = showScrollbar ? getChartScrollBarSettings(timespan) : false;
    const chartInstance = this.getChartInstance();
    const preparedChildren = React.Children.map(children,
      (child) => React.cloneElement(child, { chart: chartInstance }));

    const dataSets = getChartDataSets(data);
    let pushableChartFields = null;
    if (isReady && dataSets) {
      pushableChartFields = dataSets.map((pushableDataSet, index) => (
        <PushableChartUpdater
          key={pushableDataSet.sin}
          field={getPushableChartUpdaterFieldFromDataSet(pushableDataSet)}
          chartDataSetIndex={index}
          chartUniqId={uniqId}
          exportPushResultFunc={this.receivePushResultData}
        />
      ));
    }
    return (
      <div className={classNames('ChartWrapper Chart', className, currentPushClass)}>
        <ErrorBoundary>
          {data && data.isLoading && (
            <ChartPlaceholder>
              <ChartLoading />
            </ChartPlaceholder>
          )}
          {data && (
            <>
              {(
                (!data.isLoading && isEmptyData(data.data))
                || (isReady && chartInstance)
              ) && (
                <ChartTimespan
                  chart={chartInstance}
                  uniqId={uniqId}
                  timespans={options.timespans}
                  toggleChartTimespan={toggleChartTimespan}
                  timespan={timespan}
                  showTimespans={showTimespans}
                />
              )}
              {!data.isLoading && isEmptyData(data) && (
                <ChartPlaceholder>
                  <div className="chart-empty">{i18n.t('chart_error')}</div>
                </ChartPlaceholder>
              )}
              {pushableChartFields}
              <UncontrolledChartComponent
                data={data}
                options={options}
                type={type}
                uniqId={uniqId}
                toggleChartTimespan={toggleChartTimespan}
                timespan={timespan}
                responsiveMode={responsiveMode}
              />
              {isReady && enableScrollBar && chartInstance && (
                <ChartistScrollbar
                  uniqId={uniqId}
                  data={chartInstance.data}
                  chart={chartInstance}
                  options={options}
                />
              )}
              {preparedChildren}
            </>
          )}
        </ErrorBoundary>
      </div>
    );
  }
}
ChartWrapper.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  type: PropTypes.string,
  responsiveMode: PropTypes.string,
  isReady: PropTypes.bool,
  toggleChartTimespan: PropTypes.func,
  timespan: PropTypes.string,
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.objectOf(PropTypes.any),
  ]),
  // eslint-disable-next-line react/no-unused-prop-types
  url: PropTypes.string,
  uniqId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  options: PropTypes.objectOf(PropTypes.any),
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};
ChartWrapper.defaultProps = {
  data: {},
  isReady: false,
  type: 'Line',
  className: undefined,
  toggleChartTimespan: () => {},
  timespan: null,
  url: '',
  uniqId: generateUniqId(),
  responsiveMode: DESKTOP_MODE,
  options: {},
  children: [],
};
const mapStateToProps = (state, ownProps) => ({
  isReady: pathOr(ownProps.isReady, ['chartManager', ownProps.uniqId, 'isReady'])(state),
  responsiveMode: pathOr(DESKTOP_MODE, ['global', 'responsiveMode'])(state),
});

export default connect(mapStateToProps)(ChartWrapper);
